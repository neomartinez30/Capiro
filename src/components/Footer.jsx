import React from "react";
import CapiroLogo from "./CapiroLogo";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <CapiroLogo color="rgba(255,255,255,0.6)" height={18} />
            <p className="footer__tagline">
              The congressional submission platform for government affairs professionals.
            </p>
          </div>
          <div className="footer__links-group">
            <h4>Product</h4>
            <ul>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#ai-transparency">AI &amp; Transparency</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#why-capiro">For Congressional Offices</a></li>
            </ul>
          </div>
          <div className="footer__links-group">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Thesis</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer__links-group">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">AI Use Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__divider" />
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} Capiro, Inc. &middot; capiro.ai &middot; Built for the people who move Washington forward.
        </p>
      </div>
    </footer>
  );
}
