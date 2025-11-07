import React from "react";
import { Linkedin, Instagram, X, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-black border-t border-gray-300">
      {/* Top section */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between px-6 md:px-10 py-10 gap-10">
        {/* Left side */}
        <div className="flex flex-col max-w-[600px]">
          <div className="flex items-start gap-4 mb-5">
            <img
              src="cdpil.png"
              alt="CDPI Logo"
              className="w-[58px] h-[58px] object-contain"
            />
            <div className="text-[15px] leading-snug font-medium">
              Centre for Digital <br /> Public Infrastructure
            </div>
          </div>

          <img
            src="https://cdpi-media.s3.amazonaws.com/iiitb.png"
            alt="IIITB Logo"
            className="w-[70px] h-auto mb-5"
          />

          <div className="text-[14px] leading-relaxed text-gray-800">
            26/C, Hosur Rd, Electronic City Phase I, Electronic City, Bengaluru,
            Karnataka 560100
          </div>
          <div className="text-[14px] mt-2 text-gray-800">
            info@cdpi.dev | +91 99800 44477
          </div>

          <hr className="border-gray-300 mt-6 mb-4 w-full sm:w-[90%]" />

          <div className="text-[14px] text-gray-800 mb-4">
            Follow us on social media to stay on top of the latest news and
            insights from CDPI
          </div>

          <div className="flex gap-5 flex-wrap">
            <a href="#" className="text-black hover:opacity-70">
              <Linkedin size={18} />
            </a>
            <a href="#" className="text-black hover:opacity-70">
              <Instagram size={18} />
            </a>
            <a href="#" className="text-black hover:opacity-70">
              <X size={18} />
            </a>
            <a href="#" className="text-black hover:opacity-70">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col text-left sm:text-right sm:items-end justify-start flex-shrink-0">
          <h3 className="font-semibold text-[15px] mb-3 sm:mb-4">Resources</h3>
          <ul className="space-y-3 text-[14px] text-black">
            <li>
              <a href="#" className="hover:opacity-70">
                Read
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-70">
                Learn
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-70">
                Build
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-300 py-5 px-4 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-5 text-[13px] text-gray-700 text-center">
        <a href="#" className="hover:opacity-70">
          Terms of Use
        </a>
        <a href="#" className="hover:opacity-70">
          Privacy Policy
        </a>
        <a href="#" className="hover:opacity-70">
          Cookie Preference
        </a>
        <a href="#" className="hover:opacity-70">
          Site map
        </a>
      </div>
    </footer>
  );
};

export default Footer;
