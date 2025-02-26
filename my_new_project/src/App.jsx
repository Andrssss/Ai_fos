import React, { useState } from "react";
import Alert from "./components/Alert.jsx";
import AuthModal from "./components/AuthModal.jsx";
import UserPanel from "./components/UserPanel.jsx";
import OCRProcessor from "./components/OCRProcessor.jsx";
import "./css/main.css";

export default function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [authUser, setAuthUser] = useState({ username: "", email: "", password: "" });
  const [loggedInUser, setLoggedInUser] = useState(null);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 4000);
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
      <div className="app-container">
        <Alert message={alertMessage} type={alertType} />
        <UserPanel loggedInUser={loggedInUser} handleLogout={() => setLoggedInUser(null)} openModal={openModal} />
        <OCRProcessor showAlert={showAlert} />
        <AuthModal showModal={showModal} modalType={modalType} closeModal={closeModal} authUser={authUser} handleAuthChange={(e) => setAuthUser({ ...authUser, [e.target.name]: e.target.value })} />
      </div>
  );
}
