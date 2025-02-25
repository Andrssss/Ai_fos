from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import pytesseract
import numpy as np
import re
from sympy import sympify, latex
import os

app = Flask(__name__)
CORS(app)  # Engedélyezi a CORS-ot a frontend kapcsolat miatt

# Tesseract elérési út beállítása (Windows példa)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image(image_path):
    """Jobb OCR pontosságot célzó képfeldolgozás."""
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    
    # Adaptív küszöbölés a kontraszt növelésére
    processed = cv2.adaptiveThreshold(
        image, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2
    )
    
    # Invertálás: fehér háttér, fekete szöveg (Tesseract-nak általában ez jobb)
    inverted = cv2.bitwise_not(processed)

    return inverted

def extract_text_from_image(image_path):
    """Nyers szöveg kinyerése a képből Tesseract-tal."""
    processed_img = preprocess_image(image_path)
    
    # Karakterkészlet megadása (betűk, számok, matematikai operátorok)
    custom_config = (
        r'--oem 3 --psm 6 '
        r'-c tessedit_char_whitelist='
        r'"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/^=(){}[],Σ∑"'
    )
    
    try:
        text = pytesseract.image_to_string(processed_img, config=custom_config)
        return text.strip()
    except Exception as e:
        return f"Hiba az OCR során: {e}"

def convert_text_to_latex(text):
    """
    A kinyert szöveget szűrjük, majd ha valóban van benne matematikai
    kifejezés, Sympy-vel konvertáljuk LaTeX-re. Ha nincs, \text{}-et használunk.
    """
    # Regex: engedélyezünk ASCII betűket, számokat, 
    # magyar ékezetes betűket, szóközt, matematikai operátorokat stb.
    pattern = r'[^0-9A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s+\-\*/\^\(\)=Σ∑]'
    filtered_text = re.sub(pattern, '', text).strip()
    
    # Ha nem tartalmaz se számot, se tipikus operátort, adjuk vissza simán \text{}-tel
    if not any(char.isdigit() or char in '+-*/^=Σ∑' for char in filtered_text):
        return f"\\text{{{text}}}"

    # Ha van benne valamilyen operátor vagy szám, Sympy-vel megpróbáljuk parse-olni
    try:
        expr = sympify(filtered_text)
        return f"\\[{latex(expr)}\\]"
    except Exception:
        # Sikertelen parse esetén is visszaadjuk simán \text{}-ként
        return f"\\text{{{text}}}"

@app.route("/upload", methods=["POST"])
def upload_file():
    """Fájl fogadása és OCR + LaTeX konverzió."""
    if "image" not in request.files:
        return jsonify({"error": "Nincs feltöltött fájl"}), 400

    file = request.files["image"]
    file_path = "uploaded_image.png"
    file.save(file_path)

    # OCR
    text = extract_text_from_image(file_path)
    
    # LaTeX formátum konverzió
    latex_code = convert_text_to_latex(text)

    # Átmeneti fájl törlése
    os.remove(file_path)

    return jsonify({"latex": latex_code})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
