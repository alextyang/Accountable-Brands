import { BrandPage } from "@/app/lib/definitions"

export default function LoadingBrandPage() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className='relative flex flex-col items-center w-full'>
            <LoadingBrandSummary />
            <div className=' w-full max-w-[1800px] min-h-96 mb-16 mt-8 px-4 mx-2'> {/* Article Section */}
                <div className='flex flex-row justify-between items-end w-full'> {/* Headers */}
                    <p className=' text-2xl ml-0.5 font-medium opacity-90'></p>
                    <p className=' text-sm mb-0.5 italic opacity-90'></p>
                </div>
                <LoadingReportGrid count={['report-skel-1']} />
            </div>
        </div>
    )
  }


  function LoadingBrandSummary() {
    return (
        <div className='relative flex flex-col items-center w-full opacity-60'>
                <div className='flex flex-col w-full items-center'> {/* Brand Section */}
                    <div className='flex flex-row flex-nowrap w-full justify-end'> {/* Logo & Infocard & Products */}
                        <div className='m-6 min-w-32 min-h-32 max-w-lg w-1/5 flex flex-col justify-center items-center'>
                            <div className='w-full max-w-40 max-h-40 h-full relative skeleton skeleton-icon' style={{animationDelay: '400ms'}}> {/* Logo */}
                            </div>
                        </div>
                        <div className='relative grow flex flex-col justify-start items-end'> {/* Infocard & Products */}
                            <div className="h-12" />
                            <div className='w-full bg-black flex flex-row py-3.5 px-4 '> {/* Infocard */}
                                <div className='justify-self-start self-start opacity-40'> {/* Title & Industry */}
                                    <div className='flex flex-row items-end justify-start mt-0.5'> {/* Title + Icon */}
                                        <p className=' sm:h-9 h-7 my-1 mb-2.5 w-36 skeleton' style={{animationDelay: '200ms'}}></p>
                                        {/* <div className='block h-4 w-4 sm:h-8 sm:w-8 mb-3 -pt-0.5 sm:ml-2 ml-5 skeleton'/> */}
                                    </div>
                                        <p className='whitespace-nowrap sm:h-7 h-6 mb-1 font-regular w-28 skeleton' style={{animationDelay: '300ms'}}></p>
                                </div>
                                <div className='grow justify-self-end self-end flex flex-col justify-end items-end text-right pt-0.5 pr-2.5 opacity-40'> {/* Ownership Structure */}
                                    <div className=' sm:text-2xl text-xl font-medium sm:mb-2.5 mb-2.5 h-7 w-28 skeleton' style={{animationDelay: '300ms'}}> {/* Owner */}
                                    </div>
                                    <div className='pl-12 sm:text-base text-base tracking-wide mb-0.5 h-5 w-96 skeleton' style={{animationDelay: '400ms'}}> {/* Brands */}
                                        <div className='text-pretty'></div>
                                    </div>
                                </div> 
                            </div>
                            <div className='flex flex-row relative w-full py-3.5 px-4'> {/* Products */}
                                <div className='h-5 my-1 mb-2.5 flex justify-start w-full -mt-1'>
                                    <div className="skeleton w-28 h-full" style={{animationDelay: '400ms'}}></div>
                                </div> {/* Icons */}
                                <div className='text-right justify-end items-end justify-self-end w-full flex sm:text-base font-medium text-base tracking-normal h-5 mr-2.5' style={{animationDelay: '500ms'}}> {/* Brands */}
                                    <div className="skeleton w-96 h-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=' w-11/12  max-w-[1800px] flex flex-row px-2 pt-6'> {/* Description & Sub-Brand Logos */}
                        <div className=' w-3/4 opacity-40 add-text-shadow text-base h-24 skeleton' style={{animationDelay: '600ms'}}> {/* Description */}
                            
                        </div>
                    </div>
                </div>
            </div>
    )
  }



  export  function LoadingReportGrid({count}:{count:string[]}) {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="h-full">
            <div className='flex flex-row flex-wrap justify-stretch relative -m-2 mt-1'>

            {count.map(item => {
                return (
                    <div key={item} className={"relative h-44 sm:h-40 md:h-44 lg:h-52 2xl:h-60 3xl:h-56 basis-full lg:basis-1/2 2xl:basis-1/3 opacity-60 skeleton-wrapper"}>
                        <div className={"absolute top-0 bottom-0 right-0 left-0 m-2 border-black border-6 bg-tan/60"}> {/* Visual Box */}
                            <div className={"absolute top-0 bottom-2 sm:bottom-3 md:bottom-2 right-0 left-0 pl-3 pr-2.5 py-2.5 overflow-hidden"}> {/* Text cut off */}
                            <div className={"float-right relative ml-32 w-14 h-14 p-1 skeleton"} style={{animationDelay: '200ms'}}> {/* Type Icon & Labels */}</div>
                            <div className="h-8 mt-px mr-24 skeleton" style={{animationDelay: '100ms'}}></div>
                                    {/* Title */}
                            <div className="mt-2.5 mr-20 h-full skeleton" style={{animationDelay: '300ms'}}></div> {/* Content Preview */}
                        </div>
                    </div>
                 </div>
                )
            })}

            <div className='grow h-48'> <div className='w-full'></div> </div>
        </div>
            <div className='opacity-40 h-16 w-96 mx-auto mt-12 relative cursor-pointer skeleton'>
            </div>
        </div>
    )
  }