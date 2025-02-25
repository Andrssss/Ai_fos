import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [image, setImage] = useState(null);
  const [latexCode, setLatexCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setLatexCode(""); // Reset LaTeX output
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
      setLatexCode("Error processing image.");
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
    <div className="app-container flex flex-col items-center p-4 space-y-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Matematikai Kézírás Felismerő</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="p-2 border rounded" />

      {image && <img src={URL.createObjectURL(image)} alt="Uploaded" className="w-64 h-auto border rounded shadow" />}

      <button
        onClick={handleOCR}
        disabled={!image || loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Felismerés folyamatban..." : "Szöveg felismerése"}
      </button>

      {latexCode && (
        <>
          <textarea className="w-80 h-40 p-2 border rounded" readOnly value={latexCode} />
          <button onClick={handleDownload} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
            LaTeX letöltése
          </button>
        </>
      )}
    </div>
  );
}
