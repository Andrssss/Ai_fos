from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import pytesseract
import numpy as np
import re
from sympy import sympify, latex
import os

app = Flask(__name__)
CORS(app)

# Tesseract telepítési útvonala (Windows esetén, ha szükséges):
pytesseract.pytesseract.tesseract_cmd = "/usr/local/bin/tesseract"


def preprocess_image(image_path):
    """
    1) Kép beolvasása szürkeárnyalatosan
    2) Felskálázás (pl. 2x méret)
    3) Kontrasztfokozás (equalizeHist)
    4) MedianBlur a zaj csökkentésére
    5) Adaptív küszöbölés
    6) Morfológiai zárás (opcionális)
    7) Invertálás
    """
    # 1) Beolvasás
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    # 2) Felskálázás 2x-esre
    image = cv2.resize(image, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # 3) Kontrasztfokozás (histogram equalization)
    image = cv2.equalizeHist(image)

    # 4) Zajszűrés (median blur)
    image = cv2.medianBlur(image, 3)

    # 5) Adaptív küszöbölés
    thresh = cv2.adaptiveThreshold(
        image, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2
    )

    # 6) Morfológiai művelet (opcionális)
    kernel = np.ones((1,1), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    # 7) Invertálás (Tesseract gyakran jobban boldogul vele)
    inverted = cv2.bitwise_not(thresh)
    return inverted

def extract_text_from_image(image_path):
    """
    A preprocess_image által kontrasztosabbá és binárissá tett képből
    nyeri ki a szöveget a Tesseract, hun+eng nyelvvel.
    """
    processed_img = preprocess_image(image_path)

    # Tesseract beállítás:
    #  --oem 3 -> LSTM+legacy
    #  --psm 6 -> Egységes szövegtömbként kezeli az oldalt
    #  -l hun+eng -> Magyar és angol nyelv használata együtt
    custom_config = (
        r'--oem 3 --psm 6 '
        r'-l hun+eng'
    )

    try:
        text = pytesseract.image_to_string(processed_img, config=custom_config)
        return text.strip()
    except Exception as e:
        return f"Hiba az OCR során: {e}"

def convert_text_to_latex(text):
    """
    Továbbra is megmarad a Sympy-s LaTeX konverzió, ha matematikai
    kifejezéseket szeretnénk felismerni és LaTeX-be ágyazni.
    """
    pattern = r'[^0-9A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s+\-\*/\^\(\)=Σ∑]'
    filtered_text = re.sub(pattern, '', text).strip()

    # Ha nincs benne szám vagy matematikai operátor, sima szövegként adjuk vissza
    if not any(char.isdigit() or char in '+-*/^=Σ∑' for char in filtered_text):
        return text

    # Ha van benne matematikai kifejezés, Sympy-vel próbáljuk parse-olni
    try:
        expr = sympify(filtered_text)
        return f"\\[{latex(expr)}\\]"
    except Exception:
        # Sikertelen parse esetén visszaküldjük az eredeti szöveget
        return text

@app.route("/upload", methods=["POST"])
def upload_file():
    """
    A /upload végponton keresztül feltöltött képet
    feldolgozzuk, OCR-ezzük, és visszaküldjük a felismert
    szöveg (LaTeX) formátumú változatát.
    """
    if "image" not in request.files:
        return jsonify({"error": "Nincs feltöltött fájl"}), 400

    file = request.files["image"]
    file_path = "uploaded_image.png"
    file.save(file_path)

    # 1) OCR a képen
    text = extract_text_from_image(file_path)

    # 2) Matematikai kifejezések LaTeX konverziója (ha van)
    latex_code = convert_text_to_latex(text)

    # Ideiglenes fájl törlése
    os.remove(file_path)

    return jsonify({"latex": latex_code})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
