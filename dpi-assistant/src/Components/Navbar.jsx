import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AnimatedLogo from './Animated_logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleRedirect = () => {
    window.open('https://cdpi.dev/learn/#contact', '_blank');
  };

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 z-50">
      <div className="flex justify-between items-center py-4 px-4 md:px-8">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <AnimatedLogo />
          <div className="text-[18px] sm:text-[22px] md:text-[28px] lg:text-[31px] font-lora font-medium">
            DPI Assistant
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-[14px] lg:text-[16px] font-outfit transition ${
              isActive('/') ? 'text-black font-bold' : 'text-gray-700 hover:text-purple-600'
            }`}
          >
            DPI Assistant
          </Link>
          <Link
            to="/methodology"
            className={`text-[14px] lg:text-[16px] font-outfit transition ${
              isActive('/methodology')
                ? 'text-black font-bold'
                : 'text-gray-700 hover:text-purple-600'
            }`}
          >
            Methodology
          </Link>

          <button
            onClick={handleRedirect}
            className="bg-gradient-to-r from-[#921CF6] to-[#6861DD] w-[150px] lg:w-[190px] h-[38px] lg:h-[40px] text-[12px] lg:text-[15px] text-white rounded-md font-outfit transition hover:scale-[1.02]"
          >
            Connect with CDPI
          </button>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col items-center px-6 py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block text-[15px] font-outfit ${
                isActive('/') ? 'text-black font-bold' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              DPI Assistant
            </Link>

            <Link
              to="/methodology"
              onClick={() => setIsOpen(false)}
              className={`block text-[15px] font-outfit ${
                isActive('/methodology')
                  ? 'text-black font-bold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Methodology
            </Link>

            <button
              onClick={() => {
                handleRedirect();
                setIsOpen(false);
              }}
              className="bg-gradient-to-r from-[#921CF6] to-[#6861DD] w-full h-[40px] text-[14px] text-white rounded-md font-outfit"
            >
              Connect with CDPI
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
