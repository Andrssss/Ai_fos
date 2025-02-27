import React from "react";
import "../css/auth-panel.css"; // Import the CSS file

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

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page refresh

        if (modalType === "login") {
            handleLogin();  // 🔹 Meghívjuk a bejelentkezési függvényt
        } else if (modalType === "register") {
            handleRegister();  // 🔹 Meghívjuk a regisztrációs függvényt
        }
    };

    return (
        <div className="modal-overlay">
            <div className="auth-panel">
                <button type="close-button" className="close-button" onClick={closeModal}>×</button>

                {modalType === "login" && (
                    <>
                        <h2>Belépés</h2>
                        <form className="login-form" onSubmit={handleSubmit}>
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
                            <button type="submit" className="auth-button">
                                Belépés
                            </button>
                        </form>
                    </>
                )}

                {modalType === "register" && (
                    <>
                        <h2>Regisztráció</h2>
                        <form className="login-form" onSubmit={handleSubmit}>
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
                            <button type="submit" className="auth-button">
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
