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

  const selectedSector = sectorList.find((s) => s.id === Number(selectedSectorId));
  const selectedDpi = dpiBlocks.find((d) => d.id === Number(selectedDpiId));

  // Fetch and parse sector content from public folder
  useEffect(() => {
    if (selectedSector?.contentFile) {
      fetch(`/${selectedSector.contentFile}`)
        .then((res) => res.text())
        .then((text) => {
          const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

          // first line = title, second line = intro
          const intro = lines.slice(1, 2).join(" ");
          const bbData = [];
          let currentBB = null;

          for (let i = 2; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith("BB:")) {
              if (currentBB) bbData.push(currentBB);
              currentBB = { bbTitle: line.replace("BB:", "").trim(), bbContent: "" };
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
              setSelectedDpiId(null); // clear DPI selection
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

        {/* OR Separator */}
        <div className="text-lg md:text-xl font-outfit font-semibold text-gray-600 flex-shrink-0">
          OR
        </div>

        {/* DPI Block */}
        <div className="flex flex-col items-center w-full md:w-[360px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg md:text-xl font-outfit font-semibold text-gray-800">
              DPI Block
            </span>
          </div>
          <select
            value={selectedDpiId ?? ""}
            onChange={(e) => {
              setSelectedDpiId(e.target.value);
              setSelectedSectorId(null); // clear sector selection
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
        {/* Sector Selected */}
        {selectedSector && sectorIntro && (
          <>
   
            <h3 className="text-2xl font-semibold font-outfit text-gray-800 mb-4">
              {selectedSector.title}
            </h3>
         
            {/* BB Cards */}
            <div className="flex text-[12px] mt-[30px] mb-[5px] text-slate-500">
                 <p className="max-w-xs mx-auto font-semibold">Allow students to link all educational and skilling records through a unified Student ID</p>
                 <p className="max-w-xs mx-auto font-semibold">Allow students to auto-apply for eligible scholarships and education-assistance programs</p>
                 <p className="max-w-xs mx-auto font-semibold">Allow students and teachers to prove their credentials in a digitally verifiable manner</p>
                 </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectorBBs.map((bb, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md hover:shadow-lg transition rounded-lg p-6 text-left cursor-pointer"
                  onClick={() => setModalItem(bb)}
                >
                  <h4 className="font-semibold font-outfit text-lg text-purple-600 mb-2">
                    <div className="flex gap-[30px]">
                        
                     <img src="image.png" className="h-6 w-6" alt="" />  {bb.bbTitle}
                     </div>
                  </h4>
                  <p className="text-sm text-gray-600 font-outfit line-clamp-3">
                    {bb.bbContent.slice(0, 150)}...
                  </p>
                  <button className="mt-[20px] text-[12px] font-semibold text-slate-400">
                    View more &nbsp; &nbsp; <span>→</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* DPI Selected */}
        {!selectedSector && selectedDpi && (
          <div className="bg-white shadow-md hover:shadow-lg transition rounded-lg p-6 text-left lg:relative ">
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

      {/* Modal Popup */}
      {modalItem && (
        <CardModal item={modalItem} onClose={() => setModalItem(null)} />
      )}
    </section>
  );
};

export default Explore;
