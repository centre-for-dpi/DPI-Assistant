import React from "react";
import { Linkedin, Instagram, X, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">
            Centre for Digital <br /> Public Infrastructure
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <img
              src="image61.png"
              alt="cdpi logo"
              className="w-[80px] h-[74px] object-contain filter invert"
            />
            <img
              src="iiitb.png"
              alt="itb logo"
              className="w-[80px] h-[74px]"
            />
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            26/C, Hosur Rd, Electronic City Phase I, <br />
            Electronic City, Bengaluru, Karnataka 560100
          </p>

          <p className="text-sm text-gray-600 mt-2">
            info@cdpi.dev | +91 99800 44477
          </p>

          <p className="text-sm text-gray-600 mt-4">
            Follow us on social media to stay on top of the latest news and
            insights from CDPI
          </p>

          <div className="flex gap-4 mt-3">
            <a href="#" className="text-gray-700 hover:text-purple-600">
              <Linkedin size={18} />
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-600">
              <Instagram size={18} />
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-600">
              <X size={18} />
            </a>
            <a href="#" className="text-gray-700 hover:text-purple-600">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col sm:flex-row gap-12">
          <div>
            <h4 className="font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-purple-600 my-8">Home</a></li>
              <li><a href="#" className="hover:text-purple-600 my-8">Learning</a></li>
              <li><a href="#" className="hover:text-purple-600 my-8">DPG Deployment</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-purple-600">Read</a></li>
              <li><a href="#" className="hover:text-purple-600">Learn</a></li>
              <li><a href="#" className="hover:text-purple-600">Build</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 text-center py-5 text-sm text-gray-600 flex flex-col sm:flex-row justify-center gap-5">
        <a href="#" className="hover:text-purple-600">Terms of Use</a>
        <a href="#" className="hover:text-purple-600">Privacy Policy</a>
        <a href="#" className="hover:text-purple-600">Cookie Preference</a>
        <a href="#" className="hover:text-purple-600">Site map</a>
      </div>
    </footer>
  );
};

export default Footer;
