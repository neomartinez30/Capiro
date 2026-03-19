import React from "react";
import "../styles/Background.css";

export default function GridBackground() {
  return (
    <div className="bg-canvas">
      <div className="bg-gradient" />
      <svg className="bg-grid" width="100%" height="100%">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="bg-orb bg-orb--bottom" />
      <div className="bg-orb bg-orb--top" />
    </div>
  );
}
