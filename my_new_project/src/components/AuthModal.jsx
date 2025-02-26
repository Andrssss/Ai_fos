import React from "react";
import "../css/auth-panel.css"; // Az új CSS fájl

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
            <div className="auth-panel">
                <button type="close-button" onClick={closeModal}>×</button>

                {modalType === "login" && (
                    <>
                        <h2>Belépés</h2>
                        <form className="login-form">
                            <div className="input-group">
                                <input
                                    type="username"
                                    name="username"
                                    placeholder="Felhasználónév"
                                    value={authUser.username}
                                    onChange={handleAuthChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Jelszó"
                                    value={authUser.password}
                                    onChange={handleAuthChange}
                                    required
                                />
                            </div>
                            <button id="login" type="login-button" onClick={handleLogin}>
                                Belépés
                            </button>
                            <div className="login-bar">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Emlékezz rám</label>
                            </div>
                        </form>
                    </>
                )}

                {modalType === "register" && (
                    <>
                        <h2>Regisztráció</h2>
                        <form className="login-form">
                            <div className="input-group">
                                <input
                                    type="username"
                                    name="username"
                                    placeholder="Felhasználónév"
                                    value={authUser.username}
                                    onChange={handleAuthChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={authUser.email}
                                    onChange={handleAuthChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Jelszó"
                                    value={authUser.password}
                                    onChange={handleAuthChange}
                                    required
                                />
                            </div>
                            <button id="login" type="register-button" onClick={handleRegister}>
                                Regisztráció
                            </button>
                        </form>
                    </>
                )}

                {authMessage && <p className="auth-message">{authMessage}</p>}




            </div>
        </div>
    );
}
