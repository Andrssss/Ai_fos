import React, { useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  // OCR-hoz szükséges állapotok
  const [image, setImage] = useState(null);
  const [latexCode, setLatexCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal vezérléséhez és autentikációhoz szükséges állapotok
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "login" vagy "register"
  const [authMessage, setAuthMessage] = useState("");
  const [authUser, setAuthUser] = useState({
    username: "",
    email: "",
    password: ""
  });

  // Bejelentkezett felhasználó neve
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Képfeltöltés kezelése
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setLatexCode("");
    }
  };

  // OCR kérés kezelése
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

  // LaTeX letöltés kezelése
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([latexCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "latex_output.txt";
    document.body.appendChild(element);
    element.click();
  };

  // Autentikációs mezők változásának kezelése
  const handleAuthChange = (e) => {
    setAuthUser({ ...authUser, [e.target.name]: e.target.value });
  };

  // Modal megnyitása (regisztráció vagy bejelentkezés)
  const openModal = (type) => {
    setModalType(type);
    setAuthMessage("");
    setAuthUser({ username: "", email: "", password: "" });
    setShowModal(true);
  };

  // Modal bezárása
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
  };

  // Regisztráció – a szerver HTML választ ad
  const handleRegister = async () => {
    if (!authUser.username || !authUser.email || !authUser.password) {
      setAuthMessage("Kérlek tölts ki minden mezőt!");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", authUser.username);
      formData.append("email", authUser.email);
      formData.append("password", authUser.password);

      const response = await axios.post(
        "https://www.kacifant.hu/andris/register.php",
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      setAuthMessage(response.data);
      if (response.data.includes("Sikeres")) {
        closeModal();
      }
    } catch (error) {
      setAuthMessage("Hiba történt a regisztráció során");
    }
  };

  // Bejelentkezés – a szerver HTML választ ad
  const handleLogin = async () => {
    if (!authUser.username || !authUser.password) {
      setAuthMessage("Kérlek tölts ki minden mezőt!");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("username", authUser.username);
      formData.append("password", authUser.password);

      const response = await axios.post(
        "https://www.kacifant.hu/andris/login.php",
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (response.data.includes("Sikeres")) {
        setLoggedInUser(authUser.username); // Beállítja a felhasználó nevét
        closeModal();
      } else {
        setAuthMessage("Hibás felhasználónév vagy jelszó");
      }
    } catch (error) {
      setAuthMessage("Hiba történt a bejelentkezés során");
    }
  };

  // Kilépés kezelése
  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <div className="app-container">
      {/* Jobb felső sarok: Bejelentkezett felhasználó neve és kilépés gomb */}
      <div className="user-info">
        {loggedInUser ? (
          <>
            <span>Bejelentkezve: {loggedInUser}</span>
            <button onClick={handleLogout} className="logout-button">Kilépés</button>
          </>
        ) : (
          <span>Nincs bejelentkezve</span>
        )}
      </div>

      {/* OCR UI a közepén */}
      <div className="ocr-container">
        <h1 className="app-title">Matematikai Kézírás Felismerő</h1>
        <div className="upload-section">
          <input className="file-input" type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        {image && <img className="uploaded-image" src={URL.createObjectURL(image)} alt="Feltöltött kép" />}
        <button className={`ocr-button ${(!image || loading) ? "button-disabled" : ""}`} onClick={handleOCR} disabled={!image || loading}>
          {loading ? "Felismerés folyamatban..." : "Szöveg felismerése"}
        </button>
        {latexCode && (
          <>
            <textarea className="latex-textarea" readOnly value={latexCode} />
            <button className="download-button" onClick={handleDownload}>
              LaTeX letöltése
            </button>
          </>
        )}
      </div>

      {/* Jobb oldali panel a regisztráció/bejelentkezés gombokkal */}
      <div className="auth-panel">
        {!loggedInUser ? (
          <>
            <button onClick={() => openModal("register")}>Regisztráció</button>
            <button onClick={() => openModal("login")}>Belépés</button>
          </>
        ) : (
          <div className="user-info">
            Bejelentkezve: {loggedInUser}
          </div>
        )}
      </div>

      {/* Modal ablak */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={closeModal}>×</button>
            {modalType === "login" && (
              <>
                <h2>Belépés</h2>
                <input type="text" name="username" placeholder="Felhasználónév" value={authUser.username} onChange={handleAuthChange} />
                <input type="password" name="password" placeholder="Jelszó" value={authUser.password} onChange={handleAuthChange} />
                <button onClick={handleLogin}>Belépés</button>
              </>
            )}
            {modalType === "register" && (
              <>
                <h2>Regisztráció</h2>
                <input type="text" name="username" placeholder="Felhasználónév" value={authUser.username} onChange={handleAuthChange} />
                <input type="email" name="email" placeholder="Email" value={authUser.email} onChange={handleAuthChange} />
                <input type="password" name="password" placeholder="Jelszó" value={authUser.password} onChange={handleAuthChange} />
                <button onClick={handleRegister}>Regisztráció</button>
              </>
            )}
            {authMessage && <p className="auth-message">{authMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
