import React, { useState } from "react";
import JargonCards from "./JargonCards";
import { jargonData } from "./JargonData";

const JargonExplainer = () => {
  // ✅ Compute only letters that actually exist in jargonData
  const availableLetters = Array.from(
    new Set(jargonData.map((item) => item.term[0].toUpperCase()))
  ).sort();

  // ✅ Default selected letter = 'A' if exists, otherwise first available letter
  const [selectedLetter, setSelectedLetter] = useState(
    availableLetters.includes("A") ? "A" : availableLetters[0] || ""
  );

  // ✅ Filter jargons by selected letter
  const filteredJargons = jargonData.filter(
    (item) => item.term[0].toUpperCase() === selectedLetter
  );

  return (
    <div className="text-center font-outfit px-4">
      {/* Title and Description */}
      <div className="font-outfit md:text-[31px] text-[21px] font-semibold  text-purple-600">
        DPI Jargon Explainer
      </div>
      <p className="max-w-xl mx-auto mt-[20px] text-gray-700">
        Navigate the world of DPI with confidence. This glossary provides simple
        explanations for key terms you'll encounter.
      </p>

      {/* Alphabet Selector (Only for available letters) */}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {availableLetters.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`w-9 h-9 rounded-md text-sm font-semibold border transition ${
              selectedLetter === letter
                ? "bg-purple-600 text-white border-purple-600"
                : "border-gray-300 hover:bg-purple-50"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Info about selection */}
      {selectedLetter ? (
        <div className="mt-6 text-gray-700 font-medium">
          Showing jargons starting with:{" "}
          <span className="text-purple-600">{selectedLetter}</span>
        </div>
      ) : (
        <div className="mt-6 text-gray-500 italic">
          Click a letter to view jargons.
        </div>
      )}

      {/* Render Jargon Cards */}
      <JargonCards filteredJargons={filteredJargons} />
    </div>
  );
};

export default JargonExplainer;
