import React from "react";
import "../styles/Footer.css";
import logoWhite from "/logo-white.png";

export default function Footer() {
  return (
    <footer className="footer">
      <img src={logoWhite} alt="Capiro" className="footer__logo" />
      <p className="footer__copy">
        &copy; {new Date().getFullYear()} Capiro. All rights reserved.
      </p>
    </footer>
  );
}
