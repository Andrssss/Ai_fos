
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import torch
import cv2
import pytesseract
import numpy as np
import re
from sympy import sympify, latex
import os

app = Flask(__name__)
CORS(app)

# TroCR modell és processzor inicializálása
processor = TrOCRProcessor.from_pretrained("Rodr16020/trocr_handwriten_text_to_latex")
model = VisionEncoderDecoderModel.from_pretrained("Rodr16020/trocr_handwriten_text_to_latex")

# Tesseract telepítési útvonala (Windows esetén, ha szükséges)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"   # Andris verziója

def preprocess_image(image_path):
    """
    1) Kép beolvasása szürkeárnyalatosan
    2) Felskálázás (pl. 2x méret)
    3) Histogram equalization (kontraszt növelés)
    4) MedianBlur a zaj csökkentésére
    5) Adaptív küszöbölés
    6) Morfológiai zárás (opcionális)
    7) Invertálás
    """
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    image = cv2.resize(image, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    image = cv2.equalizeHist(image)
    image = cv2.medianBlur(image, 3)
    thresh = cv2.adaptiveThreshold(
        image, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2
    )
    kernel = np.ones((1, 1), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    inverted = cv2.bitwise_not(thresh)
    return inverted

def extract_text_with_trocr(image_path):
    """
    A TroCR modellt használja a kézírásos szöveg OCR-elésére,
    majd LaTeX kódot generál a képről.
    """
    image = Image.open(image_path).convert("RGB")
    pixel_values = processor(image, return_tensors="pt").pixel_values
    generated_ids = model.generate(pixel_values)
    text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return text.strip()

def extract_text_from_image(image_path):
    """
    A korábbi Tesseract-alapú megoldás helyett a TroCR modellt használjuk.
    """
    return extract_text_with_trocr(image_path)

def convert_text_to_latex(text):
    """
    Matematikai kifejezések LaTeX konverziója a Sympy segítségével.
    """
    pattern = r'[^0-9A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s+\-\*/\^\(\)=Σ∑]'
    filtered_text = re.sub(pattern, '', text).strip()

    # Ha nincs benne szám vagy matematikai operátor, egyszerű szövegként adjuk vissza
    if not any(char.isdigit() or char in '+-*/^=Σ∑' for char in filtered_text):
        return text

    try:
        expr = sympify(filtered_text)
        return f"\\[{latex(expr)}\\]"
    except Exception:
        return text

@app.route("/upload", methods=["POST"])
def upload_file():
    """
    A /upload végponton keresztül feltöltött képet feldolgozza,
    OCR-elés után LaTeX formátumban visszaadja.
    """
    if "image" not in request.files:
        return jsonify({"error": "Nincs feltöltött fájl"}), 400

    file = request.files["image"]
    file_path = "uploaded_image.png"
    file.save(file_path)

    # OCR a képen a TroCR modellel
    text = extract_text_from_image(file_path)

    # Matematikai kifejezések esetén LaTeX konverzió
    latex_code = convert_text_to_latex(text)

    # Ideiglenes fájl törlése
    os.remove(file_path)

    return jsonify({"latex": latex_code})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
