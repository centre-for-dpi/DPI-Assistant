import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingQuestions from "./FloatingQuestions";
import Explore from "./Explore";
import JargonExplainer from "./JargonExplainer";
import ChatBot from "./ChatBot";

const Home = () => {
  // DOM container ref used for scrollIntoView
  const chatContainerRef = useRef(null);
  // component ref used to call ChatBot's imperative handleExternalQuestion
  const chatBotRef = useRef(null);

  const handleQuestionClick = (question) => {
    // debug
    console.log("Floating question clicked:", question);

    // Scroll container (DOM node) into view
    if (chatContainerRef.current && chatContainerRef.current.scrollIntoView) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Slight delay to allow scroll animation to start / complete on slower devices
    // then call the ChatBot's exposed function
    setTimeout(() => {
      if (chatBotRef.current && typeof chatBotRef.current.handleExternalQuestion === "function") {
        chatBotRef.current.handleExternalQuestion(question);
      } else {
        console.warn("chatBotRef.handleExternalQuestion not available yet", chatBotRef.current);
      }
    }, 350);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-fuchsia-50 to-purple-100">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full py-10  ">
        {/* container for scrolling — attach DOM ref here */}
        <div ref={chatContainerRef}>
          {/* pass separate component ref to ChatBot */}
          <ChatBot ref={chatBotRef} />
        </div>

        <div className="mt-[80px] text-center">
          <h1 className="my-[20px] text-[20px] font-bold">
            Or try one of these questions
          </h1>
          <FloatingQuestions onQuestionClick={handleQuestionClick} />
        </div>

        <Explore />
        <JargonExplainer />

        {/* LEARN MORE SECTION */}
        <section className="py-2 text-center mt-[70px]">
          <h2 className="text-[26px] text-purple-600 font-outfit font-semibold">
            Get In Touch
          </h2>
          <p className="mt-3 text-gray-700 max-w-3xl mx-auto font-outfit text-[18px]">
            Looking to implement DPI or understand how it fits into your national
            digital strategy? We can help you identify opportunities and next
            steps.
          </p>
         <Link
  to="#"
  onClick={(e) => {
    e.preventDefault();
    window.open("https://cdpi.dev/learn/#contact", "_blank");
  }}
  className="mt-6 inline-block px-6 py-2 bg-indigo-500 text-white font-outfit font-semibold rounded-md hover:bg-purple-700 transition"
>
  Connect with CDPI
</Link>
        </section>

        <Footer />
      </section>
    </div>
  );
};

export default Home;
