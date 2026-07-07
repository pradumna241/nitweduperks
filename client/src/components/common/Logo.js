import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy } from 'react-icons/fa';
import './Logo.css';

const Logo = () => {
  return (
    <Link to="/" className="app-logo">
      <FaTrophy className="logo-icon" />
      <span className="logo-text">NITW EduPerks</span>
    </Link>
  );
};

export default Logo; 