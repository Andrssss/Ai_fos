import React from "react";
import "../css/alerts.css";

export default function Alert({ message, type, alertHidden }) {
    if (!message) return null;

    return (
        <div className={`alert-container ${type} ${alertHidden ? "alert-hidden" : ""}`}>
            {message}
        </div>
    );
}
