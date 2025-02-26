import React from "react";
import "../css/alerts.css";

export default function Alert({ message, type }) {
    if (!message) return null;

    return <div className={`alert-container alert-${type}`}>{message}</div>;
}
