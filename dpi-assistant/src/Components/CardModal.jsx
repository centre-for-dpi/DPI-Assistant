// src/components/CardModal.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CardModal = ({ item, onClose }) => {
  const [content, setContent] = useState("Loading...");

  useEffect(() => {
    if (!item) return;

    // Case 1: If it has bbContent (sector BB cards)
    if (item.bbContent) {
      setContent(item.bbContent);
      return;
    }

    // Case 2: If it has a file to fetch (DPI cards)
    if (item.contentFile) {
      fetch(item.contentFile)
        .then((res) => res.text())
        .then((text) => setContent(text))
        .catch(() =>
          setContent("Sorry, the content could not be loaded at this time.")
        );
    } else {
      setContent("No additional content available.");
    }
  }, [item]);

  if (!item) return null;

  // Determine modal title (works for both DPI and BB)
  const modalTitle = item.title || ` ${item.bbTitle}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-purple-100 to-purple-50">
            <h2 className="text-xl md:text-2xl font-outfit font-semibold text-gray-800">
              {modalTitle}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-3xl font-bold leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Scrollable content */}
          <div className="px-6 py-4 max-h-[60vh]  overflow-y-auto whitespace-pre-line">
            <p className="text-gray-700 font-outfit text-base text-left leading-relaxed">
              {content}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 text-right">
            <button
              onClick={onClose}
              className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition font-outfit"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CardModal;
