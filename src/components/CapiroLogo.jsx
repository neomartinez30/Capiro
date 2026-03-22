import React from "react";

export default function CapiroLogo({ color = "#fff", height = 22 }) {
  // Simple text-based logo matching brand
  return (
    <svg height={height} viewBox="0 0 90 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="2" width="20" height="20" rx="5" fill={color === "#fff" ? "rgba(58,111,247,0.35)" : "rgba(58,111,247,0.15)"} />
      <text x="6" y="17" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="13" fontWeight="600" fill={color}>C</text>
      <text x="26" y="18" fontFamily="'DM Sans', system-ui, sans-serif" fontSize="17" fontWeight="600" letterSpacing="-0.5" fill={color}>Capiro</text>
    </svg>
  );
}
