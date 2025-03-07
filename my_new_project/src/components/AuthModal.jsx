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

    const [currentModalType, setCurrentModalType] = useState(modalType);
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidUsername, setInvalidUsername] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh

        if (currentModalType === "login") {
            const success = await handleLogin();  // 🔹 Meghívjuk a bejelentkezési függvényt
            console.log(success);
            if (success == "invalidUsername")
            {
                setInvalidUsername(true);
                setTimeout(() => setInvalidUsername(false), 800);
            }
            setInvalidPassword(!success); // Ha sikertelen, akkor piros lesz a mező
            setTimeout(() => setInvalidPassword(false), 800);
        } else if (currentModalType === "register") {
            const success = await handleRegister();
            if (success == "invalidUsername")
            {
                setInvalidUsername(true);
                setTimeout(() => setInvalidUsername(false), 800);
            }
            if (success == "invalidEmail")
            {
                setInvalidEmail(true);
                setTimeout(()=> setInvalidEmail(false), 800);
            }
            if (success == "invalidPassword")
            {
                setInvalidPassword(true); // Ha sikertelen, akkor piros lesz a mező
                setTimeout(() => setInvalidPassword(false), 800);
            }
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
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Jelszó"
                                    value={authUser.password}
                                    onChange={handleAuthChange}
                                    className={`password-input ${invalidPassword ? "input-error" : ""}`} // 🔹 Itt aktiváljuk az effektet
                                />
                            </div>
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
                                    className={`username-input ${invalidUsername ? "input-error" : ""}`}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={authUser.email}
                                    onChange={handleAuthChange}
                                    className={`email-input ${invalidEmail ? "input-error" : ""}`}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Jelszó"
                                    value={authUser.password}
                                    onChange={handleAuthChange}
                                    className={`password-input ${invalidPassword ? "input-error" : ""}`}

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