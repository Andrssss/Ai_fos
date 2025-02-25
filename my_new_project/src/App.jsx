import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Fontos, hogy importáld a saját CSS-edet!

export default function App() {
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
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLatexCode(response.data.latex);
    } catch (error) {
      console.error(error);
      setLatexCode("Hiba a képfeldolgozás során.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([latexCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "latex_output.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Matematikai Kézírás Felismerő</h1>

      <div className="upload-section">
        <input
          className="file-input"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      {image && (
        <img
          className="uploaded-image"
          src={URL.createObjectURL(image)}
          alt="Feltöltött kép"
        />
      )}

      <button
        className={`ocr-button ${(!image || loading) ? "button-disabled" : ""}`}
        onClick={handleOCR}
        disabled={!image || loading}
      >
        {loading ? "Felismerés folyamatban..." : "Szöveg felismerése"}
      </button>

      {latexCode && (
        <>
          <textarea
            className="latex-textarea"
            readOnly
            value={latexCode}
          />
          <button className="download-button" onClick={handleDownload}>
            LaTeX letöltése
          </button>
        </>
      )}
    </div>
  );
}
