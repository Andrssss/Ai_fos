import React, { useState } from "react";
import Alert from "./components/Alert.jsx";
import AuthModal from "./components/AuthModal.jsx";
import UserPanel from "./components/UserPanel.jsx";
import OCRProcessor from "./components/OCRProcessor.jsx";
import axios from "axios";
import FileList from "./FileList";
import "./css/main.css";

export default function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [alertHidden, setAlertHidden] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [authUser, setAuthUser] = useState({ username: "", email: "", password: "" });
  const [loggedInUser, setLoggedInUser] = useState(null); // 🔹 Bejelentkezett felhasználó állapota
  const [ocrText, setOcrText] = useState(""); // OCR-ból kapott szöveg tárolása

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertHidden(false); // Megjelenítjük az üzenetet

    setTimeout(() => {
      setAlertHidden(true); // Elindítjuk a fade-out animációt

      // 500ms után (a CSS animáció befejezése után) töröljük az üzenetet
      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 500);
    }, 3000); // 3 másodperc után kezdődik a fade-out
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // 🔹 Bejelentkezési függvény
  const handleLogin = async () => {
    if (!authUser.username || !authUser.password) {
      showAlert("Kérlek tölts ki minden mezőt!");
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


      if (response.data.includes("login-success")) {
        setLoggedInUser(authUser.username); // Beállítja a felhasználó nevét
        closeModal();
      }
      if (response.data.includes("password-error"))
      {
        showAlert("Hibás felhasználónév vagy jelszó!", "alert-error");
      }
    } catch (error) {
      showAlert("Hiba történt a bejelentkezés során", "alert-error");

    }
  };

  // 🔹 Regisztrációs függvény (opcionálisan frissítheti az állapotot)
  const handleRegister = async () => {
    if (!authUser.username || !authUser.email || !authUser.password) {
      showAlert("Kérlek tölts ki minden mezőt!");
      return;
    }

    if (authUser.password.length < 8)
    {
      showAlert("A jelszónak legalább 8 karakternek kell lennie!", "alert-error");
      return "invalidPassword";
    }
    if (!/[A-Z]/.test(authUser.password)) {
      showAlert("A jelszónak tartalmaznia kell legalább egy nagybetűt!", "alert-error");
      return "invalidPassword";
    }

    if (!/\d/.test(authUser.password)) {
      showAlert("A jelszónak tartalmaznia kell legalább egy számot.", "alert-error");
      return "invalidPassword";
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

      showAlert(response.data);
      if (response.data.includes("Duplicate"))
      {
        if (response.data.includes("username"))
        {
          showAlert("A felhasználónév már foglalt!", "alert-error");
          return "invalidUsername";
        }
        if (response.data.includes("email"))
        {
          showAlert("A megadott email cím már foglalt!", "alert-error")
          return "invalidEmail"
        }
      }



      if (response.data.includes("success-registration")) {
        closeModal();
      }
    } catch (error) {
      showAlert("Hiba történt a regisztráció során" + error);
    }
  };

  // 🔹 OCR szöveg feltöltési függvény
  const handleUploadText = async () => {
    if (!ocrText) {
      showAlert("Nincs feltöltendő szöveg!", "alert-error");
      return;
    }

    // Ha nincs bejelentkezve vagy nincs megadva email, akkor default emailt használunk
    const email = loggedInUser && authUser.email ? authUser.email : "default@default.com";

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("szoveg", ocrText);

      const response = await axios.post(
        "https://www.kacifant.hu/andris/upload_saved_file.php",
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      showAlert(response.data);
    } catch (error) {
      showAlert("Hiba a feltöltés során: " + error.message, "alert-error");
    }
  };

  return (
    <div className="app-container">
      <Alert message={alertMessage} type={alertType} alertHidden={alertHidden} />
      <UserPanel 
        loggedInUser={loggedInUser} 
        handleLogout={() => setLoggedInUser(null)} 
        openModal={openModal} 
      />
      <FileList loggedInUser={loggedInUser} />
      {/* Az OCRProcessor beállítja az OCR-ból kapott szöveget */}
      <OCRProcessor showAlert={showAlert} setOcrText={setOcrText} loggedInUser={loggedInUser}  />
      <AuthModal 
        showModal={showModal} 
        modalType={modalType} 
        closeModal={closeModal} 
        authUser={authUser} 
        handleAuthChange={(e) => setAuthUser({ ...authUser, [e.target.name]: e.target.value })}
        handleLogin={handleLogin}  // 🔹 Átadjuk az AuthModal-nak
        handleRegister={handleRegister}  // 🔹 Átadjuk az AuthModal-nak
      />
    </div>
  );
}
