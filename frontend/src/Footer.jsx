import React from "react";
import "./footer.css";

function Footer() {
  return (
    <>
     <br/>
     <br/>
     <br/>
     <br/>
    <footer className="footer-container">
      <div className="footer-inner">
        {/* About Section */}
        <div>
          <h3 className="footer-title">About Us</h3>
          <p>
            World Hotels offers premium stays, curated experiences, and unmatched hospitality worldwide. 
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3 className="footer-title">Quick Links</h3>
          <a href="#">Home</a>
          <a href="#">Destinations</a>
          <a href="#">Book a Room</a>
          <a href="#">Contact Us</a>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3 className="footer-title">Newsletter</h3>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="footer-title">Follow Us</h3>
          <div className="footer-social-icons">
            <a href="#"><ion-icon name="logo-facebook"></ion-icon></a>
            <a href="#"><ion-icon name="logo-instagram"></ion-icon></a>
            <a href="#"><ion-icon name="logo-twitter"></ion-icon></a>
          </div>
        </div>
      </div>

      {/* Legal Section */}
      <div className="footer-legal">
        © 2024 World Hotels. All rights reserved. <a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a>
      </div>
    </footer>
    </>
  );
}

export default Footer;
