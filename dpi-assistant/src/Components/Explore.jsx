import React, { useState, useEffect } from "react";
import { sectorList, dpiBlocks } from "./ExploreData";
import CardModal from "./CardModal";

const Explore = () => {
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [selectedDpiId, setSelectedDpiId] = useState(null);
  const [modalItem, setModalItem] = useState(null);

  const [sectorIntro, setSectorIntro] = useState("");
  const [sectorBBs, setSectorBBs] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState({});

  const selectedSector = sectorList.find((s) => s.id === Number(selectedSectorId));
  const selectedDpi = dpiBlocks.find((d) => d.id === Number(selectedDpiId));

  // Fetch Sector text from S3
  useEffect(() => {
    if (selectedSector?.contentFile) {
      fetch(selectedSector.contentFile)
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
            if (line.startsWith("BB:")) {
              if (currentBB) bbData.push(currentBB);
              currentBB = {
                bbTitle: line.replace("BB:", "").trim(),
                bbContent: "",
                bbIntro: "",
              };

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
      setSectorIntro("");
      setSectorBBs([]);
    }
  }, [selectedSector]);

  // Helper for sector notes URLs
  const getNotesUrl = (sectorTitle, language) => {
    if (!sectorTitle) return "#";
    let sectorName = sectorTitle
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z]/g, "");

    if (sectorName.toLowerCase() === "digitaltransformation") {
      sectorName = "digitalTransformation";
    } else {
      sectorName = sectorName.toLowerCase();
    }
    


    const lang = language?.toLowerCase() || "english";
    return lang === "english"
      ? `https://cdpi-media.s3.amazonaws.com/${sectorName}.pdf`
      : `https://cdpi-media.s3.amazonaws.com/${lang}_${sectorName}.pdf`;
  };

  // Helper for DPI notes URLs
  const getDpiNotesUrl = (dpiTitle, language) => {
    console.log(dpiTitle,language);
    
    if (!dpiTitle) return "#";
    const lang = language?.toLowerCase() || "english";

    const mapping = {
      Registries: "registries",
      "Functional IDs": "id",
      "Data Sharing": "vc",
      Payments: "obpd",
    };

    const key = mapping[dpiTitle] || "";
    if (!key) return "#";

    return lang === "english"
      ? `https://cdpi-media.s3.amazonaws.com/${key}.pdf`
      : `https://cdpi-media.s3.amazonaws.com/${lang}_${key}.pdf`;
  };

  return (
    <section className="py-12 px-4 md:px-8 text-center mt-8">
      <h2 className="text-3xl md:text-4xl font-outfit font-semibold mb-4 text-purple-600">
        Explore DPI by Sector
      </h2>

      <p className="mt-4 md:mt-6 font-outfit text-base md:text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
        Select a sector to explore relevant Digital Public Infrastructure blocks and
        discover implementation strategies tailored to your needs.
      </p>

      {/* Dropdowns */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mt-10">
        <div className="flex flex-col items-center w-full md:w-[360px]">
          <span className="text-lg md:text-xl font-outfit font-semibold text-gray-800 mb-2">Sector</span>
          <select
            value={selectedSectorId ?? ""}
            onChange={(e) => {
              setSelectedSectorId(e.target.value);
              setSelectedDpiId(null);
            }}
            className="border border-gray-300 w-full rounded-md h-12 px-4 text-base font-outfit focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Choose a sector</option>
            {sectorList.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.title}
              </option>
            ))}
          </select>
        </div>

        <div className="text-lg md:text-xl font-outfit font-semibold text-gray-600">OR</div>

        <div className="flex flex-col items-center w-full md:w-[360px]">
          <span className="text-lg md:text-xl font-outfit font-semibold text-gray-800 mb-2">
            Components To Build DPI
          </span>
          <select
            value={selectedDpiId ?? ""}
            onChange={(e) => {
              setSelectedDpiId(e.target.value);
              setSelectedSectorId(null);
            }}
            className="border border-gray-300 w-full rounded-md h-12 px-4 text-base font-outfit focus:ring-2 focus:ring-purple-400"
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

      {/* Render Sector or DPI Cards */}
      <div className="max-w-6xl mx-auto mt-12 px-4">
        {selectedSector && sectorIntro && (
          <>
            <h3 className="text-2xl font-semibold font-outfit text-purple-600 mb-4">
              {selectedSector.title}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {sectorBBs.map((bb, index) => {
                const language = selectedLanguage[index] || "english";
                const notesUrl = getNotesUrl(selectedSector.title, language);

                return (
                  <div
                    key={index}
                    className="bg-white shadow-md hover:shadow-lg transition rounded-lg p-6 text-left border border-gray-100"
                  >
                    {bb.bbIntro && (
                      <p className="text-sm text-gray-600 mb-3 italic">
                        {bb.bbIntro}
                      </p>
                    )}

                    <h4 className="font-semibold font-outfit text-lg text-purple-700 mb-2 flex items-center gap-2">
                      <img
                        src="https://cdpi-media.s3.amazonaws.com/image.png"
                        alt=""
                        className="h-5 w-5"
                      />
                      {bb.bbTitle}
                    </h4>

                    <p className="text-sm text-gray-700 font-outfit line-clamp-3 mb-4">
                      {bb.bbContent.slice(0, 150)}...
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <select
                        value={language}
                        onChange={(e) =>
                          setSelectedLanguage({
                            ...selectedLanguage,
                            [index]: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm font-outfit focus:ring-2 focus:ring-purple-400 w-full sm:w-auto"
                      >
                        <option value="english">English</option>
                        <option value="bahasa">Bahasa</option>
                        <option value="portuguese">Portuguese</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                      </select>

                      <a
                        href={notesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-md w-full sm:w-auto text-center"
                      >
                        Notes
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!selectedSector && selectedDpi && (
          <div className="bg-white shadow-md hover:shadow-lg transition rounded-lg p-6 text-left border border-gray-100">
            <h3 className="font-semibold font-outfit text-lg md:text-xl text-purple-700">
              {selectedDpi.title}
            </h3>
            <p className="text-sm md:text-base font-outfit text-gray-600 mt-2 mb-4">
              {selectedDpi.shortDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <select
                value={selectedLanguage[selectedDpi.id] || "english"}
                onChange={(e) =>
                  setSelectedLanguage({
                    ...selectedLanguage,
                    [selectedDpi.id]: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-md px-3 py-2 text-sm font-outfit focus:ring-2 focus:ring-purple-400 w-full sm:w-auto"
              >
                <option value="english">English</option>
                <option value="bahasa">Bahasa</option>
                <option value="portuguese">Portuguese</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
              </select>

              <a
                href={getDpiNotesUrl(selectedDpi.title, selectedLanguage[selectedDpi.id])}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-md w-full sm:w-auto text-center"
              >
                Notes
              </a>
            </div>
          </div>
        )}
      </div>

      {modalItem && <CardModal item={modalItem} onClose={() => setModalItem(null)} />}
    </section>
  );
};

export default Explore;
