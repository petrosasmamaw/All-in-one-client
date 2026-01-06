import React from "react";
import {
  FaUserCircle,
  FaShoppingBag,
  FaStoreAlt,
  FaComments,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ClientFooter = () => {
  return (
    <footer className="footer client-footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>MyMarket — Client</h2>
          <p>
            Discover local sellers, explore items and services, and chat
            directly with trusted shops.
          </p>
        </div>

        <div className="footer-section">
          <h4>Client Features</h4>
          <ul>
            <li><FaUserCircle /> Create Profile</li>
            <li><FaShoppingBag /> Browse Shops</li>
            <li><FaStoreAlt /> View Shop Details</li>
            <li><FaComments /> Chat With Sellers</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li><FaEnvelope /> support@mymarket.com</li>
            <li><FaPhoneAlt /> +251 9XX XXX XXX</li>
            <li><FaMapMarkerAlt /> Ethiopia, Bahir Dar</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MyMarket Client Platform
      </div>
    </footer>
  );
};

export default ClientFooter;
