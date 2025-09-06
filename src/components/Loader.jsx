import React from "react";
import "./Loader.css";

function Loader({
  size = "medium",         // "small" | "medium" | "large"
  text = "Loading...",
  overlay = false,         // if true, render full-screen overlay
  inline = false,          // inline (no vertical padding)
  ariaLabel = "Loading",
}) {
  const loader = (
    <div
      className={[
        "ac-loader",
        `ac-loader--${size}`,
        inline ? "ac-loader--inline" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <div className="ac-loader__spinner" aria-hidden="true">
        <div className="ac-loader__circle"></div>
        <div className="ac-loader__circle"></div>
        <div className="ac-loader__circle"></div>
      </div>

      {text ? (
        <p className="ac-loader__text">
          <span className="ac-visually-hidden">{text}</span>
          {/* visible fallback for sighted users */}
          <span aria-hidden="true">{text}</span>
        </p>
      ) : null}
    </div>
  );

  if (overlay) {
    return <div className="ac-loading-overlay">{loader}</div>;
  }
  return loader;
}

export default Loader;