import Image from 'next/image'
import { Input } from 'postcss'
import { fetchBrandPage, fetchReportPages } from '@/app/lib/mediawiki'


import parseHTML from 'html-react-parser';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import ActionMenu from './actionMenu';
import { IndustryIcon, ProductIcons } from '@/app/lib/icons/dynamicIcons';
import { ReportGrid } from './reportGrid';
import Link from 'next/link';
import { Icon } from '@/app/lib/icons/ui-icons';
import { BrandPage, MW_URL, ReportPage } from '@/app/lib/definitions';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import  BrandPageError, { ReportPageError } from './error';
import { Suspense } from 'react';
import LoadingBrandPage, { LoadingReportGrid } from './loading';

const window = new JSDOM('').window;
const purifyHTML = DOMPurify(window);


function renderHTMLString(str?:string): string | JSX.Element | JSX.Element[]  {
    return parseHTML(purifyHTML.sanitize(str ? str : ''));
}


export default function Page({ params }: { params: { pageNames:string[] } }) {
    const [brandName, reportName] = [decodeURIComponent(params.pageNames[0]), decodeURIComponent(params.pageNames[1])];

    return (
        <main className="relative flex flex-col w-full">
            <ErrorBoundary errorComponent={BrandPageError}>
                <Suspense fallback={<LoadingBrandPage/>}>
                    <BrandPage brandName={brandName} />
                </Suspense>
            </ErrorBoundary>
        </main>
    )
}

async function BrandPage({brandName}:{brandName:string}) {
    const brandData = await fetchBrandPage(brandName, false);

    if (brandData.status == 'failed')
      throw new Error('Failed to fetch brand\'s page.');

    return (
        <div className='relative flex flex-col items-center w-full'>
            <BrandSummary brandData={brandData} />
            <div className=' w-full max-w-[1800px] min-h-96 mb-16 mt-8 px-4 mx-2'> {/* Article Section */}
                <div className='flex flex-row justify-between items-end w-full'> {/* Headers */}
                    <p className=' text-2xl ml-0.5 font-medium opacity-90'>{brandData.reportNames?.length}  Reports</p>
                    <p className=' text-sm mb-0.5 italic opacity-90'>All content and sources are user-submitted.</p>
                </div>
                <ErrorBoundary errorComponent={ReportPageError}>
                    <Suspense fallback={<LoadingReportGrid count={brandData.reportNames} />}>
                        <ReportsPage brandData={brandData} />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    )
}

async function ReportsPage({brandData}:{brandData:BrandPage}) {
    if (!brandData.reportNames || brandData.reportNames.length < 1) 
        return (<NoReportsFound brandName={brandData.title}/>);

    const rawReports = await fetchReportPages(brandData.reportNames, false);
    var reports: ReportPage[] = []; 
    rawReports.map(report => { 
        if (report.status == 'success')
            reports.push(report);
    });

    if (!reports || reports.length < 1) 
        return (<NoReportsFound brandName={brandData.title}/>);

    return (
        <div>
            <ReportGrid reports={reports} />
            <AddReportCard pageName={brandData.title} />
        </div>
    )
}

function NoReportsFound({brandName}:{brandName:string}) {
    return (
      <div className='flex flex-col w-full justify-center items-center p-16'>
          <Icon styles='w-16 h-16 mb-4 opacity-60' name='info' />
          <p className='text-3xl font-medium opacity-75'>&apos;{brandName}&apos; has no reports yet.</p>
          <a target="_blank" rel="noopener noreferrer" href={MW_URL+'/wiki/'+brandName} className='text-xl mt-14 font-medium opacity-75 text-center'>Found something? <span className='underline underline-offset-1'>Add it here!</span></a>
      </div>
    )
  }


async function BrandSummary({brandData}:{brandData:BrandPage}) {
    return (
        <div className='relative flex flex-col items-center w-full'>
                <div className='-z-10 absolute top-0 left-0 right-0'> {/* Background Image */}
                        {brandData.coverImage ? <Image className='w-full !h-auto top-0 object-cover mix-blend-soft-light -z-10 opacity-75 sm:opacity-60 lg:opacity-40' src={brandData.coverImage.url} alt={brandData.coverImage.alt ? brandData.coverImage.alt : ''} fill={true} sizes="100vw" style={{maskImage:'-webkit-gradient(linear, left 30%, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))'}} /> : ''}
                 </div>
                <div className='flex flex-col w-full items-center'> {/* Brand Section */}
                    <div className='flex flex-row flex-nowrap w-full justify-end'> {/* Logo & Infocard & Products */}
                        <div className='m-6 min-w-32 min-h-32 max-w-lg w-1/5 flex flex-col justify-center items-center'>
                            <div className='max-h-40 relative lg:w-3/4 lg:h-3/4 w-full h-full'> {/* Logo */}
                                {brandData.logo ? <Image className='object-contain' fill={true} sizes="33vw" src={brandData.logo.url} alt={brandData.title + ' Logo'} /> : ''}
                            </div>
                        </div>
                        <div className='relative grow flex flex-col justify-start items-end'> {/* Infocard & Products */}
                            <ActionMenu pageName={brandData.title} />
                            <div className='w-full bg-black flex flex-row py-3.5 px-4 text-tan'> {/* Infocard */}
                                <div className='justify-self-start self-start'> {/* Title & Industry */}
                                    <div className='flex flex-row items-end justify-start mt-0.5'> {/* Title + Icon */}
                                        <p className=' whitespace-nowrap sm:text-5xl text-4xl font-bold tracking-tight'>{brandData.title}</p>
                                        <IndustryIcon styles='block h-7 w-7 sm:h-8 sm:w-8 mb-1.5 -pt-0.5 sm:ml-2 ml-1 ' color='#D8C1AC' name={brandData.industry ? brandData.industry : 'default'}/>
                                    </div>
                                    <div className=' ml-0.5 -mt-0.25 -mb-0.5'> {/* Industry */}
                                        <p className='whitespace-nowrap sm:text-2xl text-xl font-regular'>{renderHTMLString(brandData.industry)}</p>
                                    </div>
                                </div>
                                <div className='grow justify-self-end self-end flex flex-col justify-end items-end text-right pt-0.5 pr-2.5 '> {/* Ownership Structure */}
                                    <div className=' sm:text-2xl text-xl font-medium sm:mb-0.5 mb-1.5'> {/* Owner */}
                                        <span className=' opacity-60'>
                                            {brandData.owner?.indexOf(' ➔ ') != -1 ? renderHTMLString(brandData.owner?.substring( 0, brandData.owner.lastIndexOf(' ➔ ') + 2 )) : ''}
                                        </span>
                                        <span className=''>
                                            {brandData.owner?.length && brandData.owner?.length > 0 ?  ' ☂ ' + renderHTMLString(brandData.owner?.substring( brandData.owner.lastIndexOf(' ➔ ') + 3 )) : ''}
                                        </span>
                                    </div>
                                    <div className='pl-12 sm:text-base text-base tracking-wide'> {/* Brands */}
                                        <div className='text-pretty'>{renderHTMLString(brandData.brands)}</div>
                                    </div>
                                </div> 
                            </div>
                            <div className='flex flex-row items-start w-full py-3.5 px-4'> {/* Products */}
                                <div className='flex flex-row justify-start  justify-self-start -ml-1'> {/* Icons */}
                                    <ProductIcons styles='h-7 w-7 sm:h-8 sm:w-8 mr-0.5 mb-1.5 -pt-0.5' pageName={brandData.title} excludeIndustry={brandData.industry ? brandData.industry : 'default'} names={brandData.products ? brandData.products.split('  •  ') : []} />
                                </div>
                                <div className='text-right grow justify-self-end pl-4 sm:text-base font-medium text-base tracking-normal '> {/* Brands */}
                                        <div className='text-balance pr-2.5 sm:-mt-1'>{renderHTMLString(brandData.products)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=' w-11/12  max-w-[1800px] flex flex-row px-2 pt-6'> {/* Description & Sub-Brand Logos */}
                        <div className='brand-content w-full lg:w-2/3 add-text-shadow text-base relative'> {/* Description */}
                            {/* <div className="absolute bg-tan opacity-75 -z-10 -top-1 -bottom-5 -right-5 -left-5"></div> */}
                            {renderHTMLString(brandData.description)}
                        </div>
                        {/* TODO: Sub-Brand Logos */}
                    </div>
                </div>
            </div>
    );

}


function AddReportCard({pageName}:{pageName:string}) {
    return (
      <div className='h-16 w-96 mx-auto mt-12 relative cursor-pointer'>
        <h2 className='text-2xl -ml-px mt-2 -mb-0.5 font-medium'>Missing something? Add it!</h2>
        <Link href="/policy" className='text-base font-normal cursor-pointer relative z-10'>Make sure to check our <span className='underline' >report policy</span> first.</Link>
        <Link href={MW_URL+'/wiki/'+pageName+'#Reports'} className='absolute top-0 bottom-0 left-0 right-0 z-00'></Link>
        <Icon styles='!absolute right-0 top-0 h-16 w-16 mr-0.5' name='add-page' />
      </div>
    );
  }
  