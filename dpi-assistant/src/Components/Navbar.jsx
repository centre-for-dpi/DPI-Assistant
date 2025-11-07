import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from "lucide-react";
import AnimatedLogo from './Animated_logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleRedirect = () => {
    window.open("https://cdpi.dev/learn/#contact", "_blank");
  };

  return (
    <>
      <header className="flex justify-between items-center py-4 px-6 md:px-8 bg-white top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <AnimatedLogo />
          <div className="text-[20px] md:text-[30px] lg:text-[31px] font-lora font-medium">
            DPI Assistant
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="flex items-center gap-6">
          {/* Button Redirect */}
          <button
            onClick={handleRedirect}
            className="md:block bg-gradient-to-r from-[#921CF6] to-[#6861DD] md:w-[190px] md:h-[40px] w-[140px] h-[35px] text-[12px] text-white px-4 py-2 rounded-md md:text-[15px] font-outfit"
          >
            Connect with CDPI
          </button>
        </div>
      </header>
    </>
  );
};

export default Navbar;
