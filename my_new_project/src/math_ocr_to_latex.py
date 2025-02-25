import cv2
import pytesseract
import numpy as np
import re
from sympy import sympify, latex

# Set Tesseract OCR path (modify for your OS)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image(image_path):
    """Preprocess image for better OCR accuracy"""
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    blurred = cv2.GaussianBlur(image, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 127, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    return thresh

def extract_text_from_image(image_path):
    """Extract raw text from image using OCR"""
    processed_img = preprocess_image(image_path)
    custom_config = r'--oem 3 --psm 6'  # Optimized for math expressions
    text = pytesseract.image_to_string(processed_img, config=custom_config)
    
    return text.strip()

def convert_text_to_latex(text):
    """Convert extracted text into LaTeX format"""
    # Remove unnecessary characters
    text = re.sub(r"[^\w\s\+\-\*/\^\(\)=]", "", text)
    
    try:
        sympy_expr = sympify(text)
        latex_expr = latex(sympy_expr)
        return f"\\[{latex_expr}\\]"
    except Exception as e:
        return f"Error converting to LaTeX: {e}"

def save_latex_to_file(latex_text, output_file="output_latex.txt"):
    """Save LaTeX text to a .txt file"""
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(latex_text)
    print(f"LaTeX saved to {output_file}")

def main():
    image_path = input("Enter the path of the math image: ")
    
    print("Extracting text...")
    extracted_text = extract_text_from_image(image_path)
    print(f"Extracted Text: {extracted_text}")

    print("Converting to LaTeX...")
    latex_code = convert_text_to_latex(extracted_text)
    print(f"LaTeX Output: {latex_code}")

    save_latex_to_file(latex_code)

if __name__ == "__main__":
    main()
