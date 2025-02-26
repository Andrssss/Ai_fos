import React from "react";
import "../css/buttons/authButtons.css";

export default function AuthModal({
                                      showModal,
                                      modalType,
                                      closeModal,
                                      authUser,
                                      handleAuthChange,
                                      handleLogin,
                                      handleRegister,
                                      authMessage
                                  }) {
    if (!showModal) return null;

    return (
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
    );
}
