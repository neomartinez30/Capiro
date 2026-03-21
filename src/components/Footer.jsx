import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer__logo-text">Capiro</span>
      <p className="footer__copy">
        &copy; {new Date().getFullYear()} Capiro. All rights reserved.
      </p>
    </footer>
  );
}
