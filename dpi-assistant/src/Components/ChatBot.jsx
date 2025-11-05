import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { sectorList } from "./ExploreData";
import { jargonData } from "./JargonData";
import CardModal from "./CardModal";
import Animated_Logo2 from "./Animated_Logo2";

const ChatBot = forwardRef((_, ref) => {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [jargonResults, setJargonResults] = useState([]);
  const [modalItem, setModalItem] = useState(null);

  // Expose method to parent (Home)
  useImperativeHandle(ref, () => ({
    handleExternalQuestion(question) {
      setQuery(question);
      setSubmitted(true);
      handleSearch(question);
    },
  }));

  const parseSectorTextToBBs = (text, sectorTitle) => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const bbList = [];
    let current = null;
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("BB:")) {
        if (current) bbList.push(current);
        current = {
          bbTitle: line.replace("BB:", "").trim(),
          bbIntro:
            lines[i - 1] && !lines[i - 1].startsWith("BB:")
              ? lines[i - 1].trim()
              : "",
          bbContent: "",
          sectorTitle,
        };
      } else if (current) {
        current.bbContent += line + " ";
      }
    }
    if (current) bbList.push(current);
    return bbList;
  };

  const handleSearch = async (overrideQuery) => {
    const searchQuery = overrideQuery || query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSubmitted(true);
    setResults([]);
    setJargonResults([]);

    const lowerQuery = searchQuery.toLowerCase();
    const matchedJargon = [];
    const matchedBBs = [];

    // Simulate AI “thinking” delay
    await new Promise((r) => setTimeout(r, 1200));

    // Search jargon
    for (const j of jargonData) {
      if (
        j.term.toLowerCase().includes(lowerQuery) ||
        j.definition.toLowerCase().includes(lowerQuery)
      ) {
        matchedJargon.push(j);
      }
    }

    // Search sectors
    for (const sector of sectorList) {
      try {
        const response = await fetch(`/${sector.contentFile}`);
        if (!response.ok) continue;
        const text = await response.text();
        if (
          sector.title.toLowerCase().includes(lowerQuery) ||
          text.toLowerCase().includes(lowerQuery)
        ) {
          const bbList = parseSectorTextToBBs(text, sector.title);
          matchedBBs.push(...bbList);
        }
      } catch (err) {
        // ignore
      }
    }

    setResults(matchedBBs);
    setJargonResults(matchedJargon);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  // 🚀 SUPER ENHANCED THINKING COMPONENT
  const AICognition = () => {
    const thinkingPhrases = [
      "Analyzing your query...",
      "Scanning DPI knowledge base...",
      "Connecting insights across domains...",
      "Formulating an intelligent response...",
    ];
    const [currentPhrase, setCurrentPhrase] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentPhrase((prev) => (prev + 1) % thinkingPhrases.length);
      }, 1600);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex flex-col gap-3 items-start w-full relative  ">
        {/* Glowing circular logo animation */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-10 h-10 rounded-full  blur-md animate-pulse"></div>
          <img src="https://cdpi-media.s3.amazonaws.com/logo_svg.svg" alt="" className="w-8 h-8 relative z-10" />
        </div>

        {/* Wave loader */}
        <div className="relative w-[160px] h-[6px] overflow-hidden rounded-full bg-purple-100">
          <div className="absolute inset-0  bg-gradient-to-r from-fuchsia-50 to-purple-100 animate-[wave_2s_linear_infinite]" />
        </div>

        {/* Changing phrase */}
        <p className="text-xs text-gray-600 italic mt-1 animate-fadeIn">
          {thinkingPhrases[currentPhrase]}
        </p>

        <style jsx>{`
          @keyframes wave {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  };

  // INITIAL UI
  if (!submitted) {
    return (
      <div className="lg:max-w-[1212px] font-outfit lg:h-[472px] md:max-w-[706px] md:h-[680px] max-w-[327px] h-[389px] mx-auto flex flex-col bg-gradient-to-r from-fuchsia-50 to-purple-100 items-start gap-4 px-6">
        <div className="bg-white w-[101px] h-[101px] md:w-[214px] md:h-[214px] lg:w-[164px] lg:h-[164px] mx-auto mt-[20px] rounded-full flex-shrink-0">
          <Animated_Logo2
            src="logo_svg.svg"
            className="mx-auto w-[71px] h-[71px] mt-[15px] md:w-[150px] md:h-[150px] lg:w-[100px] lg:h-[100px] md:mt-[29px]"
            alt=""
          />
        </div>
        <div className="mx-auto text-[24px] md:text-[64px] lg:text-[50px] font-semibold md:max-w-md lg:max-w-3xl text-center">
          Ask <span className="text-purple-600">CDPI's AI Assistant</span>
        </div>
        <p className="text-[16px] mx-auto text-center md:text-[25px] lg:text-[22px] lg:max-w-5xl">
          An interactive tool designed for global government officials to
          understand, adopt, and implement DPI for societal-scale
          transformation.
        </p>
        <div className="flex gap-[20px] md:ml-[30px] md:mt-[15px]">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-[213px] h-[56px] md:w-[526px] md:h-[47px] rounded-[10px] lg:w-[850px] lg:ml-[100px] md:text-[20px] border-black text-[13px] p-2 resize-none overflow-hidden placeholder:text-gray-500"
            placeholder="Type your question here or start with a prompt below..."
          />
          <button
            onClick={() => handleSearch()}
            className="w-[45px] h-[45px] bg-purple-500 rounded-full md:mb-[25px] hover:bg-purple-700 hover:scale-110 transition-transform"
            type="button"
          >
            <img
              className="w-[25px] h-[25px] mx-auto relative left-[2px]"
              src="https://cdpi-media.s3.amazonaws.com/Sent.png"
              alt="Send"
            />
          </button>
        </div>
      </div>
    );
  }

  // CHAT MODE
  return (
    <div className="font-outfit bg-gradient-to-r from-fuchsia-50 to-purple-100 px-6 py-6 lg:max-w-[1212px] mx-auto rounded-2xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT CHAT AREA */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[350px]">
          <div className="flex flex-col gap-4">
            <div className="self-start bg-purple-50 border border-purple-200 rounded-full px-4 py-2 text-sm text-gray-800 max-w-[80%]">
              {query}
            </div>

            <div className="flex items-start gap-2">
              <img src="https://cdpi-media.s3.amazonaws.com/logo_svg.svg" alt="" className="w-8 h-8" />
              <div
                className={`bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 min-h-[40px] flex items-center transition-all duration-500 ${
                  loading ? "shadow-[0_0_20px_rgba(168,85,247,0.4)]" : ""
                }`}
              >
                {loading ? (
                  <AICognition />
                ) : (
                  "Here are some results related to your query."
                )}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="flex mt-4 gap-3 items-center">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-[45px] rounded-[10px] text-[14px] p-2 resize-none overflow-hidden placeholder:text-gray-500 border border-gray-300"
              placeholder="Type your next question..."
            />
            <button
              onClick={() => handleSearch()}
              className="w-[40px] h-[40px] bg-purple-500 rounded-full hover:bg-purple-700 transition-transform flex justify-center items-center"
            >
              <img src="https://cdpi-media.s3.amazonaws.com/Sent.png" alt="" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RIGHT RESULTS PANEL */}
        <div className="lg:w-[45%] bg-white rounded-2xl shadow-md p-6 max-h-[520px] overflow-y-auto border border-gray-100 scroll-purple">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-600">
              Relevant Results
            </h3>
            {loading && (
              <span className="text-sm text-gray-500 animate-pulse">
                Searching...
              </span>
            )}
          </div>

          {results.length > 0 && (
            <div className="mb-6 space-y-4">
              {results.map((bb, idx) => (
                <div
                  key={`${bb.sectorTitle}-${idx}`}
                  className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => setModalItem(bb)}
                >
                  {bb.bbIntro && (
                    <p className="text-sm text-gray-600 italic mb-2">
                      {bb.bbIntro}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mb-1">
                    <img src="https://cdpi-media.s3.amazonaws.com/image.png" alt="" className="h-6 w-6" />
                    <h4 className="font-semibold text-purple-700">
                      {bb.bbTitle}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {bb.bbContent ? bb.bbContent.slice(0, 150) + "..." : ""}
                  </p>
                  <div className="mt-2 text-xs text-purple-600 font-semibold">
                    View more →
                  </div>
                </div>
              ))}
            </div>
          )}

          {jargonResults.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-md font-semibold text-purple-600 mb-3">
                Related Jargons
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jargonResults.map((j) => (
                  <div
                    key={j.id}
                    className="bg-white border border-gray-100 rounded-lg p-4"
                  >
                    <h5 className="font-semibold text-purple-700 mb-1">
                      {j.term}
                    </h5>
                    <p className="text-sm text-gray-700 leading-snug">
                      {j.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading &&
            results.length === 0 &&
            jargonResults.length === 0 && (
              <p className="text-center text-gray-500">
                No related content found for your query.
              </p>
            )}
        </div>
      </div>

      {modalItem && (
        <CardModal item={modalItem} onClose={() => setModalItem(null)} />
      )}
    </div>
  );
});

export default ChatBot;
