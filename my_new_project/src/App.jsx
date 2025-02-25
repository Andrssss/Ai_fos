import React, { useState } from "react";
import Tesseract from "tesseract.js";
import "./App.css";

export default function App() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("süti"); // Alapértelmezett érték
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      // Új kép feltöltésekor visszaállítjuk a text mezőt az alapértelmezett értékre
      setText("süti");
    }
  };

  const handleOCR = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const {
        data: { text: recognizedText },
      } = await Tesseract.recognize(
        image,
        "eng+hun", // Többnyelvű felismerés: angol és magyar
        {
          langPath: "https://tessdata.projectnaptha.com/4.0.0", // Itt adhatod meg a nyelvi fájlok elérési útvonalát
          logger: (m) => console.log(m), // Naplózza a feldolgozás lépéseit
        }
      );

      if (recognizedText.trim().length === 0) {
        setText("Nem sikerült felismerni a kézírást.");
      } else {
        setText(recognizedText);
      }
    } catch (error) {
      console.error(error);
      setText("Hiba történt a szöveg felismerésekor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container flex flex-col items-center p-4 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Kézírás Felismerő</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="p-2 border rounded"
      />

      {image && (
        <img
          src={image}
          alt="Uploaded"
          className="w-64 h-auto border rounded shadow"
        />
      )}

      <button
        onClick={handleOCR}
        disabled={!image || loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Felismerés folyamatban..." : "Szöveg felismerése"}
      </button>

      {text && (
        <textarea
          className="w-80 h-40 p-2 border rounded"
          readOnly
          value={text}
        />
      )}
    </div>
  );
}
