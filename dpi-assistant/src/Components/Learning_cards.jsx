import React, { useState } from "react";
import { contentData } from "./ContentData";

const Learning_cards = () => {
  const [selectedType, setSelectedType] = useState("Notes");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleCheckboxChange = (type) => {
    // Allow only one type at a time
    setSelectedType((prev) => (prev === type ? "" : type));
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  // Mapping of language codes to full language names (for property matching)
  const languageMap = {
    en: "English",
    sa: "Spanish",
    fr: "French",
    po: "Portuguese",
    bh: "Bahasa",
  };

  return (
    <div className="text-center font-outfit px-4">
      {/* Selection Section */}
      <div className="lg:text-[20px] md:text-[17px] sm:text-[15px]">
        Choose the content type you would like to see
      </div>

      {/* Checkbox Section */}
      <div className="flex flex-col md:flex-row justify-center items-center md:gap-[100px] mt-[20px] font-outfit md:text-[20px] text-[15px] font-normal">
        {["Notes", "Presentation", "Video"].map((type) => (
          <div key={type} className="flex items-center mb-4">
            <input
              id={type}
              type="checkbox"
              checked={selectedType === type}
              onChange={() => handleCheckboxChange(type)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded-sm focus:ring-purple-500"
            />
            <label htmlFor={type} className="ms-2 cursor-pointer">
              {type}
            </label>
          </div>
        ))}
      </div>

      {/* Language Selector */}
      <div className="text-center">
        <div className="mt-[30px] text-[12px] relative right-[30px]">
          Select your preferred language
        </div>
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="bg-white border text-left border-gray-300 rounded-md px-[90px] py-[12px] text-[12px]"
        >
          <option value="en">English</option>
          <option value="sa">Spanish</option>
          <option value="fr">French</option>
          <option value="po">Portuguese</option>
          <option value="bh">Bahasa</option>
        </select>
      </div>

      {/* Message if no type selected */}
      {!selectedType && (
        <div className="text-gray-500 mt-4">
          Please select a content type to view available materials.
        </div>
      )}

      {/* Cards */}
      <div className="flex mt-[30px] gap-[40px] lg:gap-[100px] max-w-7xl justify-center flex-wrap mb-[50px]">
        {contentData.map((item) => {
          // Build dynamic property name based on selection
          const languageName = languageMap[selectedLanguage];
          const propertyName = `${languageName}${selectedType}Link`; // e.g. "SpanishPptLink"

          const link = item[propertyName];

          return (
            <div
              key={item.id}
              className="max-w-[300px] bg-white overflow-hidden border border-gray-200"
            >
              {/* Image placeholder */}
              <div className="bg-gray-100 flex justify-center items-center h-40">
                <img
                  src={item.imageLink}
                  className="h-full w-full object-cover"
                  alt={item.title}
                />
              </div>

              {/* Card Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {item.description}
                </p>

                {/* Buttons or Not Available */}
                {selectedType ? (
                  link ? (
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => window.open(link, "_blank")}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
                      >
                        View
                      </button>
                      <a
                        href={link}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
                      >
                        Download
                      </a>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">
                      {selectedType} not available for this item in{" "}
                      {languageName}.
                    </div>
                  )
                ) : (
                  <div className="text-sm text-gray-400 italic">
                    Select a type to see actions.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Learning_cards;
