import React from "react";

export function LoadingOverlay({ text = "Loading..." }) {
  return (
    <div className="logout-overlay d-flex justify-content-center align-items-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{text}</span>
      </div>
    </div>
  );
}
