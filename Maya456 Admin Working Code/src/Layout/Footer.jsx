// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="text-center">2025 © Maya456</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
