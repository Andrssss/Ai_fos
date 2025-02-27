import React from "react";
import "../css/buttons/authButtons.css";

export default function UserPanel({ loggedInUser, handleLogout, openModal }) {
    return (
        <div className="user-info">
            {loggedInUser ? (
                <>
                    <span>Bejelentkezve: {loggedInUser}</span>
                    <button onClick={handleLogout} className="logout-button">Kilépés</button>
                </>
            ) : (
                <>
                    <button onClick={() => openModal("login")}>Belépés</button>
                </>
            )}
        </div>
    );
}
