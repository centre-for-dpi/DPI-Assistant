import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingQuestions from "./FloatingQuestions";
import { div, img } from "framer-motion/client";

const Home = () => {
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

  const quickActions = [
    { label: "Analyze Strategy Document",img: "upload.png" },
    { label: "Discuss with your team",img: "circle.png" },
    { label: "Generate Strategy Note",img: "documentation.png" },
  ];

  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full bg-white py-14 ">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-10 px-6">
          {/* Left Text Column */}
          <div className="lg:w-[55%]">
            <h1 className="font-outfit font-bold text-[32px] md:text-[42px] text-gray-900 leading-snug">
              Building foundational digital rails for{" "}
              <span className="text-purple-600">inclusive economies</span> worldwide.
            </h1>

            <p className="text-gray-600 mt-5 text-[17px] md:text-[18px] leading-relaxed">
              We have distilled the wisdom of seasoned DPI builders into an AI-powered assistant
              to help countries design and implement effective Digital Public Infrastructure.
            </p>

            {/* Country badges */}
            <p className="mt-6 font-semibold text-slate-400">Lessons from :</p>
            <div className="flex flex-wrap gap-2 mt-2 font-semibold ">
              {[ "BR", "SG", "PH", "NG", "AR", "CO"].map((code) => (
                <span
                  key={code}
                  className="p-3 text-sm bg-purple-200  border border-gray-300 rounded-full text-slate-500 shadow-sm"
                >
                  {code}
                </span>
              ))}
              <span className="text-purple-600 relative top-[10px] left-[10px] text-sm font-medium cursor-pointer">
                +many more
              </span>
            </div>

 
          </div>

          {/* Right Column: Chatbot Card */}
          <div className="lg:w-[40%] w-full flex justify-center lg:justify-end">
            <div className="bg-white shadow-2xl shadow-purple-500/20  p-8 w-full max-w-[400px] flex flex-col items-center">
              {/* Blue circular icon background */}
              <div className="bg-purple-100 w-[160px] h-[160px] rounded-full flex items-center justify-center mb-5">
                <img
                  src="dpiass.png"
                  alt="DPI Assistant"
                  className="w-[80px] h-[80px] object-contain"
                />
              </div>
              <div className="my-[20px] ">
              <h3 className="font-bold text-purple-600 text-[20px] relative left-[15px]">DPI Assistant</h3>
              <p className="text-gray-500 text-sm mt-[10px] ">Your AI assistant for DPI</p>
</div>
              {/* Ask anything input */}
              <div className="w-full border border-gray-300 rounded-lg flex items-center overflow-hidden shadow-sm">
                <input
                  type="text"
                  placeholder="Ask anything"
                  className="flex-grow px-4 py-2 text-sm text-gray-700 outline-none"
                />
                <button className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition">
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[80px] text-center">
          <h1 className="my-[20px] text-[20px] font-bold">Or try one of these questions</h1>
              <FloatingQuestions/>
              </div>
    

      {/* QUICK ACTIONS */}
      <section className="py-4 text-center mt-[30px] ">
        <h3 className=" font-semibold text-[25px] text-purple-600 font-outfit flex items-center justify-center gap-2">
          <span>⚡</span> Quick Actions
        </h3>
        <p className="text-gray-600 mt-2 text-sm">
          Start your DPI journey with these helpful actions
        </p>
<div></div>

         
        

        <div className="mt-7 flex flex-col gap-3 items-center">
          {quickActions.map((action, i) => (
        <div className="flex items-center gap-2">
           <img src={action.img} alt={action.label} className="w-6 h-6" />
          <button
              key={i}
              className="w-[90%] md:w-[600px] text-left px-5 py-3 bg-white border border-gray-300 rounded-lg font-outfit text-gray-800 hover:shadow-md transition"
            >
              {action.label}
            </button>
        </div>
           
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Free to use, built by{" "}
          <a
            href="https://cdpi.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Centre for Digital Public Infrastructure
          </a>{" "}
          💜
        </p>
      </section>
        </section>

      {/* LEARN MORE SECTION */}
      <section className="bg-white py-2 text-center">
        <h2 className="text-[26px] text-purple-600 font-outfit font-semibold">
          Want to learn more about DPI?
        </h2>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto font-outfit text-[18px]">
          Access comprehensive learning materials for Digital Public Infrastructure blocks in your
          preferred language. Download notes, presentations, and video walkthroughs to enhance your
          understanding.
        </p>
        <Link
          to="/learning"
          className="mt-6 inline-block px-6 py-2 bg-indigo-500 text-white font-outfit font-semibold rounded-md hover:bg-purple-700 transition"
        >
          Start Learning
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
