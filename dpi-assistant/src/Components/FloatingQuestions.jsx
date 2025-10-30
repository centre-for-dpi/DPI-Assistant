import React from "react";

const FloatingQuestions = () => {
  const questions = [
    "How much does it cost to implement DPI?",
    "Where do I even start?",
    "How can DPI help with financial inclusion?",
    "What are some examples of successful DPIs?",
    "Give an example technical scope for a DPI implementation?",
    "How do I identify the right DPI in my country?",
    "Do I need all ministries’ buy-in and a roadmap to start?",
    "We don’t have digital ID, can we still do social benefits DPI?",
    "DPI x AI?",
  ];

  // Shared animation
  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: flex;
          width: 200%;
          animation: marqueeScroll 35s linear infinite;
        }
        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>

      {/* First row */}
      <div className="relative w-full overflow-hidden py-4 text-[13px]">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>

        <div className="marquee-inner">
          {[...questions, ...questions].map((q, i) => (
            <div
              key={i}
              className="mx-3 shrink-0 whitespace-nowrap bg-purple-100 border border-purple-200 text-purple-800 font-medium rounded-full px-6 py-2 shadow hover:shadow-md transition-all duration-200"
            >
              {q}
            </div>
          ))}
        </div>

        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
      </div>

      {/* Second row */}
      <div className="relative w-full overflow-hidden py-4 text-[13px]">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>

        <div className="marquee-inner marquee-reverse">
          {[...questions, ...questions].map((q, i) => (
            <div
              key={i}
              className="mx-3 shrink-0 whitespace-nowrap bg-purple-50 border border-purple-200 text-purple-700 font-medium rounded-full px-6 py-2 shadow hover:shadow-md transition-all duration-200"
            >
              {q}
            </div>
          ))}
        </div>

        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
      </div>
    </>
  );
};

export default FloatingQuestions;
