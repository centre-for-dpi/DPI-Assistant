import React, { useState, useEffect } from "react";
import { sectorList, dpiBlocks } from "./ExploreData";
import CardModal from "./CardModal";

const Explore = () => {
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [selectedDpiId, setSelectedDpiId] = useState(null);
  const [modalItem, setModalItem] = useState(null);

  // new state for sector content
  const [sectorIntro, setSectorIntro] = useState("");
  const [sectorBBs, setSectorBBs] = useState([]);

  // new states for language + notes
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  const selectedSector = sectorList.find((s) => s.id === Number(selectedSectorId));
  const selectedDpi = dpiBlocks.find((d) => d.id === Number(selectedDpiId));

  // Fetch and parse sector content from public folder
  useEffect(() => {
    if (selectedSector?.contentFile) {
      fetch(`/${selectedSector.contentFile}`)
        .then((res) => res.text())
        .then((text) => {
          const lines = text
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          const intro = lines.slice(1, 2).join(" ");
          const bbData = [];
          let currentBB = null;

          for (let i = 2; i < lines.length; i++) {
            const line = lines[i];

            // Detect BB line
            if (line.startsWith("BB:")) {
              if (currentBB) bbData.push(currentBB);
              currentBB = {
                bbTitle: line.replace("BB:", "").trim(),
                bbContent: "",
                bbIntro: "", // new intro line
              };

              // Look one line above for intro text (if valid)
              if (i > 0 && lines[i - 1] && !lines[i - 1].startsWith("BB:")) {
                currentBB.bbIntro = lines[i - 1].trim();
              }
            } else if (currentBB) {
              currentBB.bbContent += line + " ";
            }
          }

          if (currentBB) bbData.push(currentBB);

          setSectorIntro(intro);
          setSectorBBs(bbData);
        })
        .catch(() => {
          setSectorIntro("Error loading content.");
          setSectorBBs([]);
        });
    } else {
      // reset when unselected
      setSectorIntro("");
      setSectorBBs([]);
    }
  }, [selectedSector]);

  // build the notes download URL
  const getNotesUrl = () => {
    if (!selectedSector) return "#";
    const sectorName = selectedSector.title.toLowerCase().replace(/\s+/g, "");
    const lang = selectedLanguage.toLowerCase();
    if (lang === "english") {
      return `https://cdpi-media.s3.amazonaws.com/${sectorName}.pdf`;
    } else {
      return `https://cdpi-media.s3.amazonaws.com/${lang}_${sectorName}.pdf`;
    }
  };

  return (
    <section className="py-12 px-4 md:px-8 text-center mt-8">
      <h2 className="text-3xl md:text-4xl font-outfit font-semibold mb-4 text-purple-600">
        Explore DPI by Sector
      </h2>

      <p className="mt-4 md:mt-6 font-outfit text-base md:text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
        Select a sector to explore relevant Digital Public Infrastructure blocks and
        <br className="hidden md:inline" />
        discover implementation strategies tailored to your needs.
      </p>

      {/* Selection Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mt-10">
        {/* Sector */}
        <div className="flex flex-col items-center w-full md:w-[360px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg md:text-xl font-outfit font-semibold text-gray-800">
              Sector
            </span>
          </div>
          <select
            value={selectedSectorId ?? ""}
            onChange={(e) => {
              setSelectedSectorId(e.target.value);
              setSelectedDpiId(null);
            }}
            className="border border-gray-300 w-full rounded-md h-12 px-4 text-base font-outfit focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Choose a sector</option>
            {sectorList.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.title}
              </option>
            ))}
          </select>
        </div>

        <div className="text-lg md:text-xl font-outfit font-semibold text-gray-600 flex-shrink-0">
          OR
        </div>

        {/* DPI Block */}
        <div className="flex flex-col items-center w-full md:w-[360px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg md:text-xl font-outfit font-semibold text-gray-800">
              Components To Build DPI
            </span>
          </div>
          <select
            value={selectedDpiId ?? ""}
            onChange={(e) => {
              setSelectedDpiId(e.target.value);
              setSelectedSectorId(null);
            }}
            className="border border-gray-300 w-full rounded-md h-12 px-4 text-base font-outfit focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Choose a DPI Block</option>
            {dpiBlocks.map((block) => (
              <option key={block.id} value={block.id}>
                {block.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-6xl mx-auto mt-12 px-4">
        {selectedSector && sectorIntro && (
          <>
            <h3 className="text-2xl font-semibold font-outfit text-purple-600 mb-4">
              {selectedSector.title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {sectorBBs.map((bb, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md hover:shadow-lg transition rounded-lg p-6 text-left cursor-pointer border border-gray-100"
                  onClick={() => setModalItem(bb)}
                >
                  {/* Intro line before BB */}
                  {bb.bbIntro && (
                    <p className="text-sm text-gray-600 mb-3 italic leading-snug">
                      {bb.bbIntro}
                    </p>
                  )}

                  {/* BB Title */}
                  <h4 className="font-semibold font-outfit text-lg text-purple-700 mb-2 flex items-center gap-2">
                    <img src="https://cdpi-media.s3.amazonaws.com/image.png" alt="" className="h-5 w-5" />
                    {bb.bbTitle}
                  </h4>

                  {/* BB Content */}
                  <p className="text-sm text-gray-700 font-outfit line-clamp-3">
                    {bb.bbContent.slice(0, 150)}...
                  </p>

                  <button className="mt-3 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-all">
                    View more →
                  </button>
                </div>
              ))}
            </div>

            {/* Language + Notes Download Section */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-base font-outfit focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="english">English</option>
                <option value="bahasa">Bahasa</option>
                <option value="portuguese">Portuguese</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
              </select>

              <a
                href={getNotesUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md transition-all"
              >
                Notes
              </a>
            </div>
          </>
        )}

        {/* DPI Selected */}
        {!selectedSector && selectedDpi && (
          <div className="bg-white shadow-md hover:shadow-lg transition rounded-lg p-6 text-left">
            <h3 className="font-semibold font-outfit text-lg md:text-xl">
              {selectedDpi.title}
            </h3>
            <p className="text-sm md:text-base font-outfit text-gray-600 mt-2 mb-4">
              {selectedDpi.shortDesc}
            </p>
            <button
              onClick={() => setModalItem(selectedDpi)}
              className="text-purple-600 font-semibold hover:underline"
            >
              Learn more →
            </button>
          </div>
        )}
      </div>

      {modalItem && <CardModal item={modalItem} onClose={() => setModalItem(null)} />}
    </section>
  );
};

export default Explore;
