import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Methodology = () => {
  return (
    <div className="font-outfit bg-gradient-to-r from-fuchsia-50 to-purple-100">
      <Navbar />

      <div className="flex flex-col items-center px-4 md:px-10 lg:px-20 relative top-[180px]">
        {/* Heading Section */}
        <div className="w-full max-w-5xl flex items-center gap-3 mb-4">
          <div className="w-[70px] h-[70px] md:w-[85px] md:h-[85px] bg-white rounded-full flex justify-center">
            <img
              src="https://cdpi-media.s3.amazonaws.com/logo_svg.svg"
              alt=""
              className="w-[40px] h-[40px] mt-[15px] md:w-[55px] md:h-[55px] md:mt-[13px]"
            />
          </div>
          <h1 className="text-[45px] md:text-[60px] font-outfit font-normal text-gray-900">
            Methodology
          </h1>
        </div>

        {/* White Content Section */}
        <div className="w-full max-w-5xl bg-[#fafafa] rounded-2xl shadow-md p-6 md:p-10">
          <div className="text-[15px] md:text-[16px] text-gray-800 font-outfit leading-relaxed space-y-4">
            <p>
              This assistant was developed after months of training on key resources from the
              World Bank, UNDP, IADB, UCL, and CDPI. It was launched at the Global DPI Summit 2025.
            </p>

            <p>
              It supports French, Spanish, Portuguese and multi-lingual responses, offers a jargon
              explainer, and provides sample decks and content to help country teams accelerate DPI
              projects. It errs on the side of minimalist responses and is focused on providing tools
              to help you progress your implementations. Built through rigorous prompt engineering to
              ensure zero hallucinations and ensure context-aware answers, the system runs on Gemini 2.5.
            </p>

            <p>
              The tech stack and sample prompt are shared below — this is a work in progress and we
              rely on ecosystem feedback to co-create and strengthen it further!
            </p>
          </div>

          {/* GitHub Link Section */}
          <div className="mt-8">
            <h3 className="font-semibold font-outfit text-[16px] text-gray-900">
              Our Product requirements document
            </h3>
            <p className="mt-1 text-[15px] font-outfit text-gray-800">
              The full structure and prompting has been published as open source on{" "}
              <a
                href="https://github.com/centre-for-dpi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:no-underline text-blue-600 underline"
              >
                CDPI GitHub link
              </a>
            </p>
          </div>

          {/* Screenshot Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="flex justify-center items-center bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-4">
              <img
                src="https://cdpi-media.s3.amazonaws.com/MethodologySS1.png"
                alt="Methodology Screenshot 1"
                className="w-full h-auto max-h-[420px] md:max-h-[450px] object-contain rounded-lg"
              />
            </div>
            <div className="flex justify-center items-center bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-4">
              <img
                src="https://cdpi-media.s3.amazonaws.com/MethodologySS1.png"
                alt="Methodology Screenshot 2"
                className="w-full h-auto max-h-[420px] md:max-h-[450px] object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Key Resources */}
          <div className="mt-10 border-t border-gray-300 pt-4 flex flex-col sm:flex-row justify-center sm:justify-start items-center sm:items-baseline gap-3 text-[15px] font-outfit">
            <span className="font-semibold text-gray-900">Key resources</span>
            <div className="flex gap-3 text-blue-600">
              <a href="#" className="hover:underline">
                Sample report link 1
              </a>
              <a href="#" className="hover:underline">
                Sample report link 2
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-[230px]">
        <Footer />
      </div>
    </div>
  );
};

export default Methodology;
