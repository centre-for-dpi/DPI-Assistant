// JargonCards.jsx
import React from "react";

const JargonCards = ({ filteredJargons }) => {
  if (!filteredJargons.length) {
    return (
      <div className="text-gray-500 text-sm italic mt-4">
        No jargon found for this letter.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-6">
      {filteredJargons.map((item) => (
        <div
          key={item.id}
          className="max-w-[250px] bg-white border border-gray-200 rounded-xl shadow-sm p-5 text-left"
        >
          <h3 className="text-lg font-semibold text-purple-700 mb-2">{item.term}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{item.definition}</p>
        </div>
      ))}
    </div>
  );
};

export default JargonCards;
