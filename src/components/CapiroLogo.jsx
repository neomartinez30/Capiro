import React from "react";

export default function CapiroLogo({ color = "#fff", height = 22 }) {
  // Always use the white logo since logo-black.png is missing/empty
  // Apply CSS filter to make it dark when needed
  const isWhite = color === "#fff" || color.includes("255") || color.includes("rgba(255");

  return (
    <img
      src="/logo-white.png"
      alt="Capiro"
      style={{
        height,
        display: "block",
        objectFit: "contain",
        filter: isWhite ? "none" : "brightness(0)",
      }}
    />
  );
}
