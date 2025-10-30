import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer';

const Case_study = () => {
  const cards = [
    {
      country: "UK",
      category: "Agriculture",
      title: "Empowering Farmers with Technology",
      description: "Case study on the use of technology to empower agriculture.",
      details: [
        "Implementation Strategy",
        "Distributing technology tools to farmers",
      ],
      outcomes: "Increased production and better market access",
    },
    {
      country: "Canada",
      category: "Healthcare",
      title: "Digital Solutions for Remote Healthcare",
      description:
        "Analysis of digital health interventions in remote areas.",
      outcomes: "Better health monitoring and patient engagement",
    },
    {
      country: "Canada",
      category: "Healthcare",
      title: "Digital Solutions for Remote Healthcare",
      description:
        "Analysis of digital health interventions in remote areas.",
      outcomes: "Better health monitoring and patient engagement",
    },
    {
      country: "Canada",
      category: "Healthcare",
      title: "Digital Solutions for Remote Healthcare",
      description:
        "Analysis of digital health interventions in remote areas.",
      outcomes: "Better health monitoring and patient engagement",
    },
  ];

  return (
    <div className='bg-gray-100 w-full'>
        <Navbar/>

        <div className='mt-[30px]'>
          <h1 className='text-[21px] md:text-[27px] text-purple-600 font-outfit text-center'>DPI Implementation Case Studies</h1>
          <p className='font-outfit  max-w-3xs md:max-w-2xl mx-auto text-center mt-[10px]'>Learn from successful Digital Public Infrastructure deployments across the globe. Discover proven strategies and outcomes from leading implementations.</p>
        </div>
         <section className="py-12 px-4 md:px-8 text-center mt-[10px]">
          {/* Selection Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 ">
            {/* Sector */}
            <div className="flex flex-col items-center w-full md:w-[360px]">
              <div className="flex items-center gap-2 mb-2">
                <img src="People.png" alt="Sector Icon" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                <span className="text-lg md:text-xl font-outfit font-semibold text-gray-800">
                  Sector
                </span>
              </div>
              <select className="border border-gray-300 bg-white w-full rounded-md h-[40px] px-4 text-base font-outfit focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option>Choose a sector</option>
              </select>
            </div>

            {/* OR Separator */}
            <div className="text-lg md:text-xl font-outfit font-semibold text-gray-600 flex-shrink-0">
              OR
            </div>

            {/* DPI Block */}
            <div className="flex flex-col items-center w-full md:w-[360px]">
              <div className="flex items-center gap-2 mb-2">
                <img src="Puzzle.png" alt="DPI Icon" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                <span className="text-lg md:text-xl font-outfit font-semibold text-gray-800">
                  DPI Block
                </span>
              </div>
              <select className="border bg-white border-gray-300 w-full rounded-md  h-[40px] px-4 text-base font-outfit focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option>Choose a DPI Block</option>
              </select>
            </div>
          </div>
        </section>

         <div className="lg:max-w-3xl md:max-w-md max-w-[370px] mx-auto px-4 py-10 font-outfit">
      {/* grid: 1 col default, 1 col md, 2 cols lg */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.map((card, idx) => (
          <article
            key={idx}
            className="bg-white  rounded-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            {/* IMAGE / MEDIA AREA */}
            <div className="mb-4">
              {/* Use an explicit aspect box so all cards align */}
              <div className="w-full bg-gray-100 rounded-xl overflow-hidden h-44 flex items-center justify-center">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // centered placeholder icon + subtle outline like your screenshot
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9A2.5 2.5 0 0118.5 19H5.5A2.5 2.5 0 013 16.5v-9zM8 12l2.5 3L13 11l3 4"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* TAGS */}
            <div className="flex gap-2 mb-3">
              <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded-full">
                {card.country}
              </span>
              <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded-full">
                {card.category}
              </span>
            </div>

            {/* TITLE */}
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-sm mb-3">{card.description}</p>

            {/* DETAILS (optional list) */}
            {card.details && (
              <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
                {card.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}

            {/* OUTCOMES */}
            <p className="text-sm font-medium text-gray-800 mb-2">
               <span className="font-semibold">Key Outcomes: <br /></span>  <span className='font-normal'>{card.outcomes}</span>
            </p>

            <a
              href="#"
              className="text-purple-600 text-sm mt-3 inline-block font-medium hover:underline"
            >
              Read full story →
            </a>
          </article>
        ))}
      </div>
    </div>
    <Footer/>
    </div>
  )
}

export default Case_study