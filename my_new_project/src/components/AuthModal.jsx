import React, { useState, useEffect } from "react";
import "../css/auth-panel.css"; // Import the CSS file
import axios from "axios";

export default function AuthModal({
      showModal,
      modalType,
      closeModal,
      authUser,
      setAuthUser,
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
    const [usernameStatus, setUsernameStatus] = useState(null);
    const [emailStatus, setEmailStatus] = useState(null);
    const [checking, setChecking] = useState(false);


    useEffect(() => {
        if (!authUser.username && !authUser.email && authUser.username.length < 3 && authUser.username.length < 3) return;

        const timeoutId = setTimeout(() => {
            checkAvailability(authUser.username, authUser.email);
        }, 500);

        return () => clearTimeout(timeoutId); // Ha új billentyűt nyom, törli az előző kérést
    }, [authUser.username, authUser.email]);

    const checkAvailability = async (username, email) => {
        if (!username && !email) return;
        setChecking(true);

        try {
            const response = await axios.get(
                "https://www.kacifant.hu/andris/check-availability.php",
                { params: { username, email } }
            );

            const responseData = response.data.trim();

            if (responseData === "username-taken") {
                setUsernameStatus(false);
                setEmailStatus(null);
            } else if (responseData === "email-taken") {
                setUsernameStatus(null);
                setEmailStatus(false);
            } else if (responseData === "username-email-taken") {
                setUsernameStatus(false);
                setEmailStatus(false);
            } else {
                setUsernameStatus(true);
                setEmailStatus(true);
            }
        } catch (error) {
            console.error("Hiba az ellenőrzés során:", error);
            setUsernameStatus(null);
            setEmailStatus(null);
        }
        setChecking(false);
    };
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
                                    className={`username-input ${usernameStatus === false ? "input-error" : ""}`}
                                />
                                <div className="input-icon">
                                    {checking ? (
                                        <div className="spinner"></div> // 🔄 Töltés animáció
                                    ) : usernameStatus !== null ? (
                                        usernameStatus ? (
                                            <span className="success-icon">✔</span> // ✅ Szabad
                                        ) : (
                                            <span className="error-icon">❌</span> // ❌ Foglalt
                                        )
                                    ) : null}
                                </div>

                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={authUser.email}
                                    onChange={handleAuthChange}
                                    className={`email-input ${emailStatus === false ? "input-error" : ""}`}
                                    //{checking && <p>Ellenőrzés...</p>}
                                />
                                <div className="input-icon">
                                    {checking ? (
                                        <div className="spinner"></div> // 🔄 Töltés animáció
                                    ) : emailStatus !== null ? (
                                        emailStatus ? (
                                            <span className="success-icon">✔</span> // ✅ Szabad
                                        ) : (
                                            <span className="error-icon">❌</span> // ❌ Foglalt
                                        )
                                    ) : null}
                                </div>
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