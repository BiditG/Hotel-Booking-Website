import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import "./Contact.css";

function Contact() {
  return (
    <center>
    <div className="contact-form-container-custom">
      <h2 className="contact-form-title">Contact Us</h2>
      <form action="#" method="POST" className="contact-form-custom">
        <div className="input-group-custom">
          <label htmlFor="name" className="input-label-custom">Full Name</label>
          <input type="text" id="name" name="name" className="input-field-custom" required />
        </div>

        <div className="input-group-custom">
          <label htmlFor="email" className="input-label-custom">Email Address</label>
          <input type="email" id="email" name="email" className="input-field-custom" required />
        </div>

        <div className="input-group-custom">
          <label htmlFor="message" className="input-label-custom">Your Message</label>
          <textarea id="message" name="message" rows="6" className="textarea-field-custom" required></textarea>
        </div>

        <button type="submit" className="submit-btn-custom">Send Message</button>
      </form>
    </div>
  </center>
);

}

export default Contact;
