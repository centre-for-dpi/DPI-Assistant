import React from "react";

const ChatBot = () => {
  return (
    <section className="pt-8 px-4 w-full">
      <div className="max-w-full mx-auto border border-gray-200 lg:border-none rounded-xl bg-white flex flex-col justify-between px-[20px] py-[20px] lg:h-[440px]">
        <div className="p-4 flex flex-col justify-start items-start space-y-3 flex-grow bg-gray-100 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex justify-center items-center p-1 shrink-0">
              <img src="dpiass.png" alt="" />
            </div>
            <div className="max-w-lg bg-white rounded-xl p-3 text-gray-800 text-xs md:text-sm shadow-sm font-outfit">
              Hello! I'm  CDPI AI  , your Digital Public Infrastructure assistant.
              Ask me anything about  DPI implementation  ,  best practices  , or
                sector-specific guidance  .
            </div>
          </div>

          <div className="w-full flex justify-end pt-2 pr-0 md:pr-4">
            <div className="space-y-2 w-full max-w-sm">
              <div className="w-full bg-white border border-purple-400 rounded-lg p-2 text-xs text-gray-800 cursor-pointer transition duration-150 ease-in-out hover:bg-purple-50 font-outfit">
                Provide an example of a policy that supports the adoption of DPI
              </div>
              <div className="w-full bg-white border border-purple-400 rounded-lg p-2 text-xs text-gray-800 cursor-pointer transition duration-150 ease-in-out hover:bg-purple-50 font-outfit">
                Summarize the impact of  Estonia's X-Road   on  e-governance  
              </div>
              <div className="w-full bg-white border border-purple-400 rounded-lg p-2 text-xs text-gray-800 cursor-pointer transition duration-150 ease-in-out hover:bg-purple-50 font-outfit">
                Explain the concept of  interoperability  
              </div>
              <div className="w-full bg-white border border-purple-400 rounded-lg p-2 text-xs text-gray-800 cursor-pointer transition duration-150 ease-in-out hover:bg-purple-50 font-outfit">
                Difference between  Digital Public Infrastructure   and{" "}
                 traditional IT infrastructure  
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 md:p-4 pt-0 border-t border-gray-100 mt-4">
          <div className="flex items-center w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <input
              type="text"
              placeholder="Type your question...."
              className="flex-grow p-3 text-gray-700 text-sm outline-none border-none font-outfit"
            />
            <button className="bg-none hover:bg-purple-700 p-3 shrink-0 transition duration-150 ease-in-out">
              <img src="Frame78.png" className="h-[30px] w-[30px]" alt="" />
            </button>
          </div>
        </div>
      </div>

      <p className="my-[30px] mx-auto md:max-w-md text-center sm:max-w-sm text-neutral-500">
        Get instant answers about Digital Public Infrastructure implementation, best practices, and
        sector-specific guidance.
      </p>
    </section>
  );
};

export default ChatBot;
