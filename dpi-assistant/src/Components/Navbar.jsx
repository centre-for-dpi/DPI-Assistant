import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="relative flex justify-between items-center py-4 px-6 md:px-8 shadow-sm bg-white sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="dpiass.png"
            className="w-[34px] h-[33px]"
            alt="Logo"
          />
          <div className="text-[24px] md:text-[21px] lg:text-[31px] font-lora font-medium">
            DPI Assistant
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 text-[18px] md:text-[13px] lg:text-[20px] font-outfit">
            <Link
              to="/"
              className={`hover:text-purple-600 ${isActive('/') ? 'font-bold text-purple-600' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/learning"
              className={`hover:text-purple-600 ${isActive('/learning') ? 'font-bold text-purple-600' : ''}`}
            >
              Learning
            </Link>
            <Link
              to="/dpi-deployment"
              className={`hover:text-purple-600 ${isActive('/dpi-deployment') ? 'font-bold text-purple-600' : ''}`}
            >
              DPI Deployment
            </Link>
          </nav>

          {/* Desktop Button */}
          <button className="hidden md:block bg-gradient-to-r from-[#921CF6] to-[#6861DD] w-[173px] h-[48px] text-white px-4 py-2 rounded-md text-[18px] font-outfit">
            Get in Touch
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden flex items-center justify-center text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center py-6 gap-4 font-outfit text-[18px] md:hidden z-50">
            <Link
              to="/"
              className={`hover:text-purple-600 ${isActive('/') ? 'font-bold text-purple-600' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/learning"
              className={`hover:text-purple-600 ${isActive('/learning') ? 'font-bold text-purple-600' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Learning
            </Link>
            <Link
              to="/dpi-deployment"
              className={`hover:text-purple-600 ${isActive('/dpi-deployment') ? 'font-bold text-purple-600' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              DPI Deployment
            </Link>

            <button className="bg-gradient-to-r from-[#921CF6] to-[#6861DD] text-white px-6 py-2 rounded-md text-[18px] font-outfit mt-2">
              Start Exploring
            </button>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
