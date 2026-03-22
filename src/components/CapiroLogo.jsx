import React from "react";

export default function CapiroLogo({ color = "#fff", height = 22 }) {
  // Use the actual brand logo images from public/
  const src = color === "#fff" || color.includes("255") || color.includes("rgba(255")
    ? "/logo-white.png"
    : "/logo-black.png";

  return (
    <img
      src={src}
      alt="Capiro"
      style={{ height, display: "block", objectFit: "contain" }}
    />
  );
}
