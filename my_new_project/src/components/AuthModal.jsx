import React, { useState } from "react";
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

    const [invalidPassword, setInvalidPassword] = useState(false);
    const [currentModalType, setCurrentModalType] = useState(modalType); // 🔹 Kezeli a modal váltását

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh

        if (currentModalType === "login") {
            const success = await handleLogin();  // 🔹 Meghívjuk a bejelentkezési függvényt
            setInvalidPassword(!success); // Ha sikertelen, akkor piros lesz a mező
        } else if (currentModalType === "register") {
            handleRegister();  // 🔹 Meghívjuk a regisztrációs függvényt
            setInvalidPassword(false); // Regisztrációkor nincs ilyen ellenőrzés
        }
    };
    const toggleModalType = () => {
        setCurrentModalType(currentModalType === "login" ? "register" : "login");
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            closeModal(); // 🔹 Csak akkor zárja be, ha a háttérre kattintanak
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="auth-panel">
                <button type="close-button" className="close-button" onClick={closeModal}>×</button>

                {currentModalType === "login" ? (
                    <>

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
                                    className={invalidPassword ? "input-error" : ""}
                                />
                            </div>
                            {invalidPassword && <p className="error-message">Hibás jelszó!</p>}
                            <button type="submit" className="auth-button">
                                Belépés
                            </button>
                        </form>
                        <p className="switch-auth">
                            Még nincs fiókod? <button onClick={toggleModalType} className="switch-button" >Regisztrálj!</button>
                        </p>
                    </>
                ) : (
                    <>

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
                        <p className="switch-auth">
                            Már van fiókod? <button onClick={toggleModalType} className="switch-button">Jelentkezz be!</button>
                        </p>
                    </>
                )}

                {authMessage && <p className="auth-message">{authMessage}</p>}
            </div>
        </div>
    );
}
