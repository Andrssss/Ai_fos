import React, { useState } from "react";
import axios from "axios";
import "../css/main.css";

export default function OCRProcessor({ showAlert }) {
    const [image, setImage] = useState(null);
    const [latexCode, setLatexCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setLatexCode("");
        }
    };

    const handleOCR = async () => {
        if (!image) {
            showAlert("Nincs kép feltöltve!", "warning");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setLatexCode(response.data.latex);
            showAlert("Sikeres felismerés!", "success");
        } catch (error) {
            showAlert("Hiba a képfeldolgozás során.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ocr-container">
            <h1 className="app-title">Matematikai Kézírás Felismerő</h1>
            <div className="upload-section">
                <input className="file-input" type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
            {image && <img className="uploaded-image" src={URL.createObjectURL(image)} alt="Feltöltött kép" />}
            <button className={`ocr-button ${(!image || loading) ? "button-disabled" : ""}`} onClick={handleOCR} disabled={!image || loading}>
                {loading ? "Felismerés folyamatban..." : "Szöveg felismerése"}
            </button>
            {latexCode && <textarea className="latex-textarea" readOnly value={latexCode} />}
        </div>
    );
}
