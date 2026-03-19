import React from "react";
import "../styles/Features.css";

export default function FeatureCard({ icon, title, desc, delay = 0 }) {
  return (
    <div className="feature-card" style={{ animation: `fadeSlideUp 0.7s ease ${delay}s both` }}>
      <div className="feature-card__icon">{icon}</div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{desc}</p>
    </div>
  );
}
