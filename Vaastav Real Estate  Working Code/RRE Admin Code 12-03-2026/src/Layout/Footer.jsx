// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="text-center">
              <p>© {currentYear} Vaastav Real Estate Pvt Ltd. All rights reserved.</p>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
