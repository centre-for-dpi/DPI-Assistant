import React from "react";
import { Linkedin, Instagram, X, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const handleRedirect = () => {
    window.open('https://cdpi.dev/learn/#contact', '_blank');
  };
  return (
    <footer className="bg-white text-black border-t border-gray-300">
      {/* Top section */}
      <div className="max-w-7xl mx-auto flex   justify-between px-6 md:px-10 ">
        {/* Left side */}
       
            <img
              src="https://cdpi-media.s3.amazonaws.com/logoMain.png"
              alt="CDPI Logo"
              className="w-[258px] h-[88px] object-contain"
            />

  <button
            onClick={handleRedirect}
            className="bg-gradient-to-r mt-[20px] from-[#921CF6] to-[#6861DD] w-[150px] lg:w-[190px] h-[38px] lg:h-[40px] text-[12px] lg:text-[15px] text-white rounded-md font-outfit transition hover:scale-[1.02]"
          >
            Connect with CDPI
          </button>
      </div>
    </footer>
  );
};

export default Footer;
