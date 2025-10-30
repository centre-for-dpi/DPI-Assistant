import React from 'react'

function Blocks() {
  return (
    <div className="text-gray-800">
     
      <header className="flex  h-[120px] justify-between items-center py-4 px-8 shadow-sm bg-white">
        <img src="image61.png" className="w-[54px] h-[53px] top-[34px] left-[75px] bg-blend-exclusion object-contain bg-black text-black filter invert" alt="" />
        <div className="text-[31px] font-lora relative right-[150px] font-medium">DPI Explorer</div>
        <nav className="flex gap-6 text-[20px] font-outfit relative left-[120px] ">
          <a href="#" className="hover:text-purple-600 w-[55px] h-[25px] top-[47px] font-bold ">Home</a>
          <a href="#" className="hover:text-purple-600">Learning</a>
          <a href="#" className="hover:text-purple-600">DPI Deployment</a>
          <a href="#" className="hover:text-purple-600">Case Study</a>
        </nav>
        <button className="relative   bg-gradient-to-r from-[#921CF6] to-[#6861DD] w-[173px] h-[48px] text-white px-4 py-2 rounded-md text-[20px] font-outfit">Start Exploring</button>
      </header>

      
      <section className="text-center py-16 px-6 bg-gray-100">
        <h1 className=" font-normal font-outfit text-[64px]">
          <span className="text-purple-600">Simplifying</span> Digital Public <br /> Infrastructure
               (<span className="text-purple-600">DPI</span>)
        </h1>
        <p className="mt-4 text-gray-600  text-[25px] font-normal font-outfit">
          An interactive tool designed for global government officials to understand, adopt, <br />
          and implement DPI for societal-scale use.
        </p>
        <button className="mt-6 bg-gradient-to-r from-[#921CF6] to-[#6861DD] text-[20px] text-white px-6 py-2 rounded-md font-outfit">Start Exploring</button>
      </section>

    
      <section className="bg-gray-50 py-12 px-6 text-center">
        <h2 className="text-[39px] text-purple-600 font-semibold mb-4">What is DPI?</h2>
        <p className=" max-w-3xl mx-auto font-outfit text-[20px] font-normal">
          The term <span className="text-purple-600 text-[20px]  font-normal">Digital Public Infrastructure</span>  primarily used to describe an approach to addressing socio-economic problems at population scale. This approach (a) combines open technology standards (b) with robust governance frameworks (c) to encourage private community innovation (d) to address societal scale challenges such as financial inclusion, affordable healthcare, quality education, climate change, access to justice and beyond.
          <br /> <br />
          <p>Examples include <span className="text-purple-600">Aadhaar</span> in India, <span className="text-purple-600">Pix</span> in Brazil, <span className="text-purple-600">Fayda</span> in Ethiopia and so on. </p>
        </p>
        <div className="flex justify-center gap-8 mt-[50px]">
        <img className="w-[134.67px] h-[85.85px] mx-[30px]" src="Logo.png" alt="Aadhaar" />
          <img className="w-[185px] h-[85px] mx-[30px]" src="pix.png" alt="Aadhaar" /> 
           <img className="w-[80px] h-[78px] mx-[30px]" src="fayada.png" alt="Aadhaar" /> 
        </div>
        <div className="flex justify-center gap-8 relative bottom-[100px]">
        <img className="w-[43px] h-[42px] mx-[30px] relative right-[20px]" src="India.png" alt="Aadhaar" />
          <img className="w-[42px] h-[42px] mx-[30px] relative left-[120px]" src="Brazil.png" alt="Aadhaar" /> 
           <img className="w-[42px] h-[42px] mx-[30px] relative left-[157px]" src="Ethiopia.png" alt="Aadhaar" /> 
        </div>
      </section>

     
      <section className="py-12 px-6 text-center">
        <h2 className="text-xl font-normal font-outfit text-[39px] text-purple-600 mb-8">See the Explorer in Action</h2>
        <div className="w-full max-w-3xl mx-auto  flex items-center justify-center">
          <img src="placeholder.png" className="w-[751px] h-[305px]" alt="" />
          
        </div>
        <img src="Frame15.png" className="w-[751px] h-[48px] ml-[262px]" alt="" />
        <p className="text-[20px] font-outfit font-normal mt-4 max-w-lg mx-auto">
          This short video provides a walkthrough of how to use the DPI Explorer to find
          relevant information for your country’s specific needs.
        </p>
      </section>



     
      <div className="bg-gray-100">
      <section className=" py-12 px-6 text-center mt-[30px]">
        <h2 className="text-xl font-outfit font-semibold mb-6 text-[39px] mt-[80px] text-purple-600">Explore DPI by Sector</h2>
        <p className="mt-[50px] font-outfit text-[20px]">Select a sector to explore relevant Digital Public Infrastructure blocks and <br /> discover implementation strategies tailored to your needs.</p>
      
       <div className="flex flex-wrap justify-center gap-4 mb-6 mt-[50px] text-[31px] font-outfit">
          <div className="  flex mr-[220px] ">
            <img src="People.png" alt="" />  Sector
          </div>
          
          <div className="  flex ml-[150px] ">
            <img src="Puzzle.png" alt="" />  DPI Block
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6 mt-[20px]">
          <select className="border w-[345px] h-[47px] px-10 py-2 rounded-md text-sm mx-[60px]">
            <option>Choose a sector</option>
          </select>
          <span className="text-[31px] font-outfit font-normal relative bottom-[50px]">OR</span>
          <select className="border w-[345px] h-[47px] px-10 py-2 rounded-md text-sm mx-[60px]">
            <option>Choose a DPI Block</option>
          </select>
        </div>

        <div className="grid md:grid-cols-3  gap-6 max-w-4xl mx-auto mt-[70px] ">
          <div className="bg-white shadow p-6 rounded-lg  ">
            <div className=" flex items-center mb-4 ">
            <img src="Contact.png " className="w-[56px] h-[56px]" alt="" />
            <h3 className="font-semibold font-outfit mb-2 text-[20px] ml-[10px]">Functional IDs</h3>
            </div>
            <p className="text-[13px] my-[25px] font-outfit font-normal">Allow students to link all educational and skilling records through a unified Student ID.</p>
            <a href="#" className=" text-purple-600 text-sm relative right-[60px] font-bold  ">Learn more →</a>
          </div>

          <div className="bg-white shadow p-6 rounded-lg  ">
            <div className=" flex items-center mb-4 ">
            <img src="Document.png " className="w-[56px] h-[56px]" alt="" />
            <h3 className="font-semibold font-outfit mb-2 text-[20px] ml-[10px]">Registries</h3>
            </div>
            <p className="text-[13px] my-[25px] font-outfit font-normal">Allow students to auto-apply for eligible scholarships and education-assistance programs</p>
            <a href="#" className=" text-purple-600 text-sm relative right-[60px] font-bold  ">Learn more →</a>
          </div>
          
          <div className="bg-white shadow p-6 rounded-lg  ">
            <div className=" flex items-center mb-4 ">
            <img src="Cloud.png " className="w-[56px] h-[56px]" alt="" />
            <h3 className="font-semibold font-outfit mb-2 text-[20px] ml-[10px]">Data Sharing</h3>
            </div>
            <p className="text-[13px] my-[25px] font-outfit font-normal">Allow students and teachers to prove their credentials in a digitally verifiable manner</p>
            <a href="#" className=" text-purple-600 text-sm relative right-[60px] font-bold  ">Learn more →</a>
          </div>

        </div>
      </section>

      
      <section class="py-6 px-4">

    <h2 class="text-2xl flex justify-center font-semibold mb-3 text-purple-600 font-outfit">Ask CDPI AI</h2>
    <p class="flex justify-center text-center text-sm font-outfit text-gray-700">Get instant answers about Digital Public Infrastructure implementation, best <br /> practices, and sector-specific guidance.</p>

    <div class="max-w-4xl mx-auto mt-4 border border-gray-200 rounded-xl bg-white  flex flex-col justify-between px-[20px] py-[20px]">
        
        <div class="p-4 flex flex-col justify-start items-start space-y-3 flex-grow bg-gray-100">
            
            <div class="flex items-start space-x-3">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-full flex justify-center items-center p-1 shrink-0">
                    
                      <img src="Frame77.png" alt="" />
                </div>
                
                <div class="max-w-lg bg-white rounded-xl p-3 text-gray-800 text-xs md:text-sm shadow-sm font-outfit">
                    Hello! I'm **CDPI AI**, your Digital Public Infrastructure assistant. Ask me anything about **DPI implementation**, **best practices**, or **sector-specific guidance**.
                </div>
            </div>

            <div class="w-full flex justify-end pt-2 pr-0 md:pr-4">
                <div class="space-y-2 w-full max-w-sm">
                    
                    <div class="w-full bg-white border border-purple-400 rounded-lg p-2 text-xs text-gray-800 cursor-pointer transition duration-150 ease-in-out hover:bg-purple-50 font-outfit">
                        Provide an example of a policy that supports the adoption of DPI
                    </div>

                    <div class="w-full bg-white border border-purple-400 rounded-lg p-2 text-xs text-gray-800 cursor-pointer transition duration-150 ease-in-out hover:bg-purple-50 font-outfit">
                        Summarize the impact of **Estonia's X-Road** on **e-governance**
                    </div>

                    <div class="w-full bg-white border border-purple-400 rounded-lg p-2 text-xs text-gray-800 cursor-pointer transition duration-150 ease-in-out hover:bg-purple-50 font-outfit">
                        Explain the concept of **interoperability**
                    </div>

                    <div class="w-full bg-white border border-purple-400 rounded-lg p-2 text-xs text-gray-800 cursor-pointer transition duration-150 ease-in-out hover:bg-purple-50 font-outfit">
                        difference between **Digital Public Infrastructure** and **traditional IT infrastructure**
                    </div>
                    
                </div>
            </div>
        </div>
        
        <div class="p-3 md:p-4 pt-0 border-t border-gray-100">
            <div class="flex items-center w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
                <input 
                    type="text" 
                    placeholder="Type your question...." 
                    class="flex-grow p-3 text-gray-700 text-sm outline-none border-none font-outfit"
                />
                <button class="bg-purple-600 hover:bg-purple-700 p-3 shrink-0 transition duration-150 ease-in-out border rounded-lg">
                  <img src="Frame78.png" className="h-[30px] w-[30px]" alt="" />
                </button>
            </div>
        </div>
    </div>

    
</section>


<div>
  <h2 className="text-center mt-[50px] text-[30px] text-purple-600  font-outfit">Wanna learn more about DPI?</h2>
  <p className="text-center mt-[10px]  text-[20px] font-outfit max-w-3xl mx-auto">
Access comprehensive learning materials for Digital Public Infrastructure blocks in your preferred language. Download notes, presentations, and video walkthroughs to enhance your understanding.</p>
</div>

</div>

    
      <footer className="bg-white py-8 px-6 mt-12 border-t relative bottom-[30px] ">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-sm">
          <div className="relative right-[150px]">
            <div className="flex ">
            <img src="image61.png" alt="" />
            <h4 className="font-semibold mb-2 ml-[10px] text-[25px] font-outfit mt-[5px]">DPI Explorer</h4>
            </div>
            <p className="font-outfit mt-[20px]">Empowering government officials with clear, accessible information about Digital Public Infrastructure deployment across sectors.</p>
          </div>

          <div className="relative left-[350px]">
            <h4 className="font-semibold font-outfit mb-2">Navigation</h4>
            <ul className="space-y-1 font-outfit">
              <li><a href="#">Home</a></li>
              <li><a href="#">Learning</a></li>
              <li><a href="#">DPI Deployment</a></li>
              <li><a href="#">Case Study</a></li>
            </ul>
          </div>

          <div className="relative left-[230px] font-outfit">
            <h4 className="font-semibold mb-2  ">Sources</h4>
            <ul className="space-y-1">
              <li>Digital Public Goods</li>
              <li>World Bank</li>
              <li>G20</li>
              <li>MOSIP</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Blocks