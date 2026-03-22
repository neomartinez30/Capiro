import React from "react";
import CapiroLogo from "./CapiroLogo";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <CapiroLogo color="rgba(255,255,255,0.4)" height={16} />
      <p className="footer__copy">
        &copy; {new Date().getFullYear()} Capiro. All rights reserved.
      </p>
    </footer>
  );
}
