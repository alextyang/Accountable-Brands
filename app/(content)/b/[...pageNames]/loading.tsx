import { ParsedBrandPage } from "@/app/data/definitions"

export default function LoadingBrandPage() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className='relative flex flex-col items-center w-full'>
            <LoadingBrandSummary />
            <div className=' w-full max-w-[1800px] min-h-96 mb-16 mt-8 px-4 mx-2'> {/* Article Section */}
                <div className='flex flex-row items-end justify-between w-full'> {/* Headers */}
                    <p className=' text-2xl ml-0.5 font-medium opacity-90'></p>
                    <p className=' text-sm mb-0.5 italic opacity-90'></p>
                </div>
                {/* <LoadingReportGrid count={['report-skel-1']} /> */}
            </div>
        </div>
    )
}


function LoadingBrandSummary() {
    return (
        <div className='relative flex flex-col items-center w-full opacity-60'>
            <div className='flex flex-col items-center w-full'> {/* Brand Section */}
                <div className='flex flex-col justify-end w-full md:flex-row flex-nowrap'> {/* Logo & Infocard & Products */}
                    <div className='relative flex items-center justify-center h-full mx-20 mt-10 xs:mx-32 mb-14 md:mx-8 md:my-auto md:w-1/5 md:max-w-lg min-w-32 min-h-32'>
                        <div className='w-full h-full max-w-40 max-h-40 skeleton skeleton-icon' style={{ animationDelay: '400ms' }}> {/* Logo */}
                        </div>
                    </div>
                    <div className='relative flex flex-col items-end justify-start -mt-14 grow md:mt-0'> {/* Infocard & Products */}
                        <div className="relative h-14 aspect-square mt-0.5 -mb-1 p-1" />
                        <div className='bg-black flex flex-col md:gap-2 md:flex-row py-3.5 pr-2 pl-4 md:pr-4 md:pl-4 text-tan mx-2 md:mx-0 self-stretch'> {/* Infocard */}
                            <div className='flex flex-row flex-wrap self-start justify-between w-full gap-x-4 md:flex-col justify-self-start md:w-auto md:gap-0 opacity-40'> {/* Title & Industry */}
                                <div className='flex flex-row items-end justify-start mt-0.5'> {/* Title + Icon */}
                                    <p className=' sm:h-9 h-7 my-1 mb-2.5 w-36 skeleton' style={{ animationDelay: '200ms' }}></p>
                                    {/* <div className='block h-4 w-4 sm:h-8 sm:w-8 mb-3 -pt-0.5 sm:ml-2 ml-5 skeleton'/> */}
                                </div>
                                <p className='h-6 mr-2 md:mr-0 md:ml-0.5 mt-0.5 md:-mt-0.25 -mb-0.5 whitespace-nowrap sm:h-7 font-regular w-28 skeleton' style={{ animationDelay: '300ms' }}></p>
                            </div>
                            <div className='grow justify-self-end self-end flex flex-col justify-start md:justify-end items-end text-left w-full md:text-right pt-1 pr-2.5 -mt-1 md:mt-0 gap-2 lg:gap-0 opacity-40'> {/* Ownership Structure */}
                                <div className=' sm:text-2xl text-xl font-medium md:mb-0.5 mb-2.5  h-7 w-28 skeleton' style={{ animationDelay: '300ms' }}> {/* Owner */}
                                </div>
                                <div className='md:pl-12 sm:text-base text-base tracking-wide mb-0.5 h-5 w-96 skeleton' style={{ animationDelay: '400ms' }}> {/* Brands */}
                                    <div className='text-pretty'></div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col-reverse md:flex-row relative w-full py-3.5 pl-6 md:px-4'> {/* Products */}
                            <div className='h-5absolute top-4 md:top-auto md:relative justify-self-start-ml-1 mr-1.5 md:mr-0'>
                                <div className="h-full skeleton w-28" style={{ animationDelay: '400ms' }}></div>
                            </div> {/* Icons */}
                            <div className='text-right justify-end items-end justify-self-end w-full flex sm:text-base md:ml-4 font-medium text-base tracking-normal h-5 mr-2.5' style={{ animationDelay: '500ms' }}> {/* Brands */}
                                <div className="h-full -mt-1 skeleton w-96"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' w-11/12  max-w-[1800px] flex flex-row -mr-2 md:mr-0 pl-2 md:px-2 pt-6'> {/* Description & Sub-Brand Logos */}
                    <div className='h-24 text-base lg:w-2/3 opacity-40 add-text-shadow skeleton' style={{ animationDelay: '600ms' }}> {/* Description */}

                    </div>
                </div>
            </div>
        </div>
    )
}



export function LoadingReportGrid({ count }: { count: string[] }) {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="h-full">
            <div className='relative flex flex-row flex-wrap mt-1 -m-2 justify-stretch'>

                {count.map(item => {
                    return (
                        <div key={item} className={"relative h-44 sm:h-40 md:h-44 lg:h-52 2xl:h-60 3xl:h-56 basis-full lg:basis-1/2 2xl:basis-1/3 opacity-60 skeleton-wrapper"}>
                            <div className={"absolute top-0 bottom-0 right-0 left-0 m-2 border-black border-6 bg-tan/60"}> {/* Visual Box */}
                                <div className={"absolute top-0 bottom-2 sm:bottom-3 md:bottom-2 right-0 left-0 pl-3 pr-2.5 py-2.5 overflow-hidden"}> {/* Text cut off */}
                                    <div className={"float-right relative ml-32 w-14 h-14 p-1 skeleton"} style={{ animationDelay: '200ms' }}> {/* Type Icon & Labels */}</div>
                                    <div className="h-8 mt-px mr-24 skeleton" style={{ animationDelay: '100ms' }}></div>
                                    {/* Title */}
                                    <div className="mt-2.5 mr-20 h-full skeleton" style={{ animationDelay: '300ms' }}></div> {/* Content Preview */}
                                </div>
                            </div>
                        </div>
                    )
                })}

                <div className='h-48 grow'> <div className='w-full'></div> </div>
            </div>
            <div className='relative h-16 mx-auto mt-12 cursor-pointer opacity-40 w-96 skeleton'>
            </div>
        </div>
    )
}