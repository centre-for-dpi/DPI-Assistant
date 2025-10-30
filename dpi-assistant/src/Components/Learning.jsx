import React from 'react'
import Navbar from './Navbar'
import JargonExplainer from './JargonExplainer'
import Footer from './Footer'
import Learning_cards from './Learning_cards'
import Explore from './Explore'


const Learning = () => {

  

  return (
    <>
      <div className='w-full   bg-gray-100'>
        <Navbar />

        <div className='text-center   mt-[30px] text-outfit'>
           {/* What is DPI Section */}
      <section className=" py-4 px-6 text-center">
        <h2 className="text-[39px] text-purple-600 font-semibold mb-4">What is DPI?</h2>
        <p className="max-w-3xl mx-auto font-outfit text-[20px] font-normal">
          The term <span className="text-purple-600 text-[20px] font-normal">Digital Public Infrastructure</span>{" "}
          primarily used to describe an approach to addressing socio-economic problems at population scale. This
          approach (a) combines open technology standards (b) with robust governance frameworks (c) to encourage
          private community innovation (d) to address societal scale challenges such as financial inclusion,
          affordable healthcare, quality education, climate change, access to justice and beyond.
          <br /> <br />
          <span>
            Examples include <span className="text-purple-600">Aadhaar</span> in India,{" "}
            <span className="text-purple-600">Pix</span> in Brazil, <span className="text-purple-600">Fayda</span> in
            Ethiopia and so on.
          </span>
        </p>
       <div className="">
        <div className="flex justify-center gap-8 mt-[50px]">
          <img className="md:w-[134.67px] md:h-[85.85px] mx-[30px] w-[64px] h-[40px]" src="Logo.png" alt="Aadhaar" />
          <img className="md:w-[185px] md:h-[85px] mx-[30px] w-[64px] h-[40px]" src="pix.png" alt="Pix" />
          <img className="md:w-[80px] md:h-[78px] mx-[30px] w-[64px] h-[40px]" src="fayada.png" alt="Fayda" />
        </div>
        <div className="flex  justify-center gap-8 relative bottom-[100px] md:bottom-[150px]">
          <img className="md:w-[43px] md:h-[42px] md:mx-[30px] relative md:right-[20px]  w-[20px] h-[20px] mx-[30px] top-[50px] right-[10px]" src="India.png" alt="India" />
          <img className="md:w-[42px] md:h-[42px] md:mx-[30px] relative md:left-[120px] w-[20px] h-[20px] mx-[30px] top-[50px] left-[40px]" src="Brazil.png" alt="Brazil" />
          <img className="md:w-[42px] md:h-[42px] md:mx-[30px] relative md:left-[157px] w-[20px] h-[20px] mx-[30px] top-[50px] left-[75px]" src="Ethiopia.png" alt="Ethiopia" />
        </div>
        </div>
      </section>

        <Explore/>

          <h1 className='text-[18px] md:text-[26px] font-semibold font-outfit text-purple-600'>DPI Learning Materials</h1>
          <p className='mt-[5px]  text-center max-w-2xl mx-auto  font-outfit' >
            Access comprehensive learning materials for Digital Public Infrastructure blocks in your preferred language.
            Download notes, presentations, and video walkthroughs to enhance your understanding
          </p>
        </div>

      


        

      
        {/* Cards */}
        <div className='flex mt-[30px] gap-[10px] lg:gap-[80px] justify-center flex-wrap mb-[50px] px-4'>
           <Learning_cards/>
        </div>
       
       <JargonExplainer/>

        <div className='mt-[60px] text-outfit text-center'>
          <div className='text-center md:text-[31px] text-[21px] font-outfit text-purple-600'>Learn more about DPI Deployments</div>
           <p className='font-outfit max-w-3xl mx-auto text-center mt-[17px]'>Discover Digital Public Goods available for deploying your selected DPI blocks and explore certification opportunities to enhance your implementation capabilities.</p>        
           <button className='bg-purple-600 text-white px-4 py-2 rounded-md mt-4 font-semibold '>Explore DPGs</button>
        </div>
         <Footer/>
      </div>
    </>
  )
}

export default Learning