import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer';

const Dpi_deployment = () => {
    const CaseStudyCards = [
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

    const cards = [
        {
            logo: "download2.png",
            title: "Sunbird",
            desc: "An open-source platform for digital learning and training experiences.",
        },
        {
            logo: "download3.png",
            title: "OpenG2P",
            desc: "A platform for secure, reliable government to persons payments.",
        },
        {
            logo: "download4.png",
            title: "MOSIP",
            desc: "A free, open-source software that countries can use to build their own national-scale digital ID systems.",
        },
       {
    logo: "data:image/png;base64,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",
    title: "OpenSPP",
    desc: "An open-source social protection platform designed to support inclusive and efficient social programmes.",
},
{
    logo: "https://github.com/nordic-institute/X-Road/blob/develop/xroad_logo_small.png?raw=true",
    title: "X-Road",
    desc: "A secure data exchange layer enabling seamless and interoperable digital services between organisations. :contentReference[oaicite:0]{index=0}",
},
{
    logo: "https://openspp.org/wp‐content/uploads/2024/02/openspp_logo.png", /* placeholder until Cerdibl logo found */
    title: "Cerdibl",
    desc: "A certification platform enabling trusted credentials and verifiable digital certificates for institutions.",
},

    ];

    return (
        <div className='w-full bg-gray-100 '>
            <Navbar />
            <div className='mt-[50px] text-center font-outfit'>
                <div className='md:text-[31px] text-[21px] text-purple-600'>DPI Deployment Options</div>
                <p className='max-w-3xl mx-auto mt-[10px]'>Discover Digital Public Goods available for deploying your selected DPI blocks and explore certification opportunities to enhance your implementation capabilities.</p>
            </div>

            <div className='mt-[30px] lg:w-[899px] lg:h-[363px] md:w-[686px] md:h-[613px] w-[327px] h-[368px] bg-white mx-auto text-center'>
                <img src="handle.png" className='md:w-[105px] md:h-[105px] mx-auto w-[50px] h-[50px]' alt="" />
                <div className='mt-[20px] font-outfit font-semibold text-[21px] md:text-[31px]'>About Digital Public <span className='md:hidden'><br /></span> Goods (DPGs)</div>
                <p className='text-[13px] md:text-[20px] lg:max-w-2xl md:max-w-[300px]  max-w-[300px] mx-auto font-outfit'>Digital Public Goods are open-source software, open data, open AI models, open standards, and open content that adhere to privacy and other applicable laws and best practices.</p>
                <div className='lg:flex text-center gap-[30px] mx-auto items-center mt-[30px] font-outfit ml-[50px] md:ml-[180px] md:mt-[50px] lg:mt-[30px] lg:ml-[-50px]'>
                    <div className='flex lg:ml-[130px] my-[10px] md:my-[20px] lg:my-0'>
                        <img src="badge.png " className='md:w-[44px] md:h-[44px] w-[18px] h-[18px] ' alt="" />
                        <div className='md:mt-[8px] md:text-[20px] lg:text-[15px]'>Open source and Transparent</div>
                    </div>
                    <div className='flex my-[10px] md:my-[20px] lg:my-0 '>
                        <img src="badge.png" className='md:w-[44px] md:h-[44px] w-[18px] h-[18px]' alt="" />
                        <div className='md:mt-[8px] md:text-[20px] lg:text-[15px]'>Cost-effective deployment</div>
                    </div>
                    <div className='flex my-[10px] md:my-[20px] lg:my-0'>
                        <img src="badge.png" className='md:w-[44px] md:h-[44px] w-[18px] h-[18px]' alt="" />
                        <div className='md:mt-[8px] md:text-[20px] lg:text-[15px]'>Community-driven development</div>
                    </div>
                </div>

            </div>

            <div className='text-center mx-auto mt-[60px]'>
                <div className='text-[21px] md:text-[31px] text-purple-600 font-outfit'>Discover DPGs</div>
               
                <div className='flex mx-auto justify-center gap-[80px]'>
                    <button className='bg-indigo-500 text-white rounded-[6px] px-[25px] py-[10px] mt-[27px] text-outfit text-[12px] font-semibold'>Get in touch </button>
                </div>
            </div>

            {/* UPDATED GRID LAYOUT (3 in lg, 2 in md/sm) */}
            <div className="lg:max-w-5xl max-w-md font-outfit mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-between h-full items-center text-center transition-transform hover:scale-105 hover:shadow-md"
                        >
                            <img src={card.logo} alt={card.title} className="h-10 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                            <p className="text-black text-[12px] mb-4">{card.desc}</p>
                            <a
                                href="#"
                                className="text-purple-600 font-medium hover:underline flex gap-1 text-[15px]"
                            >
                                Learn more <span>&nbsp;&nbsp;&nbsp;</span>  <span className='text-black font-bold'>  →  </span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <div className='bg-white w-[327px] h-[167px] md:w-[706px] md:h-[212px] lg:w-[1020px] lg:h-[337px] mx-auto text-center'>
                <div className='text-[15px] md:text-[20px] pt-[20px] font-semibold text-purple-600'>DaaS</div>
                <p className='text-[10px] md:text-[15px]  max-w-xs lg:max-w-xl md:max-w-[260px] mx-auto mt-[15px]'>DPI as a packaged Solution (DaaS) refers to the rapid deployment of DPI, primarily through upgrades of existing infrastructure (rather than greenfield implementations), often avoiding new or complex procurement processes where existing systems and vendors can be reused.</p>
                <button className=' border-[2px] rounded-[6px] px-[25px] py-[7px] mt-[20px] text-outfit text-[12px] font-bold bg-purple-600 text-white'>Connect with us for a prepacked rollout</button>
                <p className='font-semibold mt-[20px]'>See how  Countries are using DaaS Implementation</p>
                <button className='bg-white text-purple-600 border-purple-600 border-[2px] rounded-[6px] px-[25px] py-[7px] mt-[20px] text-outfit text-[12px] font-bold '>Explore certification in DPG integration &nbsp;&nbsp;<span className='text-gray-500'>→</span></button>
            </div>

            <div className='mt-[90px]'>
                <h1 className='text-[21px] md:text-[27px] text-purple-600 font-outfit text-center'>DPI Implementation Case Studies</h1>
                <p className='font-outfit  max-w-3xs md:max-w-2xl mx-auto text-center mt-[10px]'>Learn from successful Digital Public Infrastructure deployments across the globe. Discover proven strategies and outcomes from leading implementations.</p>
            </div>

            <section className="py-12 px-4 md:px-8 text-center mt-[10px]">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 ">
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

                    <div className="text-lg md:text-xl font-outfit font-semibold text-gray-600 flex-shrink-0">
                        OR
                    </div>

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
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
                    {CaseStudyCards.map((card, idx) => (
                        <article
                            key={idx}
                            className="bg-white  rounded-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="mb-4">
                                <div className="w-full bg-gray-100 rounded-xl overflow-hidden h-44 flex items-center justify-center">
                                    {card.image ? (
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
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

                            <div className="flex gap-2 mb-3">
                                <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded-full">
                                    {card.country}
                                </span>
                                <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded-full">
                                    {card.category}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>

                            <p className="text-gray-600 text-sm mb-3">{card.description}</p>

                            {card.details && (
                                <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
                                    {card.details.map((d, i) => (
                                        <li key={i}>{d}</li>
                                    ))}
                                </ul>
                            )}

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

            <Footer />
        </div>
    )
}

export default Dpi_deployment
