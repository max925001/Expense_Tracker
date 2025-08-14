import React from 'react';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-white p-4 text-center text-green-700 shadow-md mt-auto">
      <div className="flex justify-center space-x-6 mb-2">
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 transition" aria-label="Visit our LinkedIn">
          <FaLinkedin className="text-2xl sm:text-3xl" />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 transition" aria-label="Visit our Instagram">
          <FaInstagram className="text-2xl sm:text-3xl" />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 transition" aria-label="Visit our Facebook">
          <FaFacebook className="text-2xl sm:text-3xl" />
        </a>
      </div>
      <p className="text-sm">&copy; 2025 Expense Tracker. All rights reserved.</p>
    </footer>
  );
};

export default Footer;