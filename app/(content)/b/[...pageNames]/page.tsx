import Image from 'next/image'
import { Input } from 'postcss'
import { fetchBrandPage, fetchReportPages } from '@/app/lib/mediawiki'


import parseHTML from 'html-react-parser';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import ActionMenu from './actionMenu';
import { IndustryIcon, ProductIcons } from '@/app/lib/utils/iconPicker/iconComponents';
import { ReportGrid } from './reportGrid';
import Link from 'next/link';
import { Icon } from '@/app/lib/icons/interfaceIcons';
import { BrandPage as BrandPageType, MW_URL, ReportPage } from '@/app/lib/definitions';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import BrandPageError, { ReportPageError } from './error';
import { Suspense } from 'react';
import LoadingBrandPage, { LoadingReportGrid } from './loading';

const window = new JSDOM('').window;
const purifyHTML = DOMPurify(window);


function renderHTMLString(str?: string): string | JSX.Element | JSX.Element[] {
    return parseHTML(purifyHTML.sanitize(str ? str : ''));
}


export default function Page({ params }: { params: { pageNames: string[] } }) {
    const [brandName, reportName] = [decodeURIComponent(params.pageNames[0]), decodeURIComponent(params.pageNames[1])];

    return (
        <main className="relative flex flex-col w-full">
            <ErrorBoundary errorComponent={BrandPageError}>
                <Suspense fallback={<LoadingBrandPage />}>
                    <BrandPage brandName={brandName} />
                </Suspense>
            </ErrorBoundary>
        </main>
    )
}

async function BrandPage({ brandName }: { brandName: string }) {
    const brandData = await fetchBrandPage(brandName, false);

    if (brandData.status == 'failed')
        throw new Error('Failed to fetch brand\'s page.');

    return (
        <div className='relative flex flex-col items-center w-full'>
            <BrandSummary brandData={brandData} />
            <div className=' w-full max-w-[1800px] min-h-96 mb-16 mt-8 px-4 mx-2'> {/* Article Section */}
                <div className='flex flex-row flex-wrap items-end ml-0.5 justify-between w-full gap-x-2'> {/* Headers */}
                    <p className='text-2xl font-medium opacity-90'>{brandData.reportNames?.length}  Reports</p>
                    <p className=' text-sm mb-0.5 italic opacity-90'>All content and sources are user-submitted.</p>
                </div>
                <ErrorBoundary errorComponent={ReportPageError}>
                    <Suspense fallback={<LoadingReportGrid count={brandData.reportNames} />}>
                        <ReportsPage brandData={brandData} />
                    </Suspense>
                </ErrorBoundary>
            </div>
            {brandData.references || brandData.importedReferences ? <BrandReferences brandData={brandData} /> : ''}
        </div>
    )
}

async function ReportsPage({ brandData }: { brandData: BrandPageType }) {
    if (!brandData.reportNames || brandData.reportNames.length < 1)
        return (<NoReportsFound brandName={brandData.name} brandUrlName={brandData.url_name} />);

    const rawReports = await fetchReportPages(brandData.reportNames, false);
    var reports: ReportPage[] = [];
    rawReports.map(report => {
        if (report.status == 'success')
            reports.push(report);
    });

    if (!reports || reports.length < 1)
        return (<NoReportsFound brandName={brandData.name} brandUrlName={brandData.url_name} />);

    return (
        <div>
            <ReportGrid reports={reports} />
            <AddReportCard pageName={brandData.name} pageUrlName={brandData.url_name} />
        </div>
    )
}

function NoReportsFound({ brandName, brandUrlName }: { brandName: string, brandUrlName: string }) {
    return (
        <div className='flex flex-col items-center justify-center w-full p-16'>
            <Icon className='w-16 h-16 mb-4 opacity-60' name='info' />
            <p className='text-3xl font-medium opacity-75'>&apos;{brandName}&apos; has no reports yet.</p>
            <a target="_blank" rel="noopener noreferrer" href={MW_URL + '/wiki/' + brandUrlName} className='text-xl font-medium text-center opacity-75 mt-14'>Found something? <span className='underline underline-offset-1'>Add it here!</span></a>
        </div>
    )
}

async function BrandReferences({ brandData }: { brandData: BrandPageType }) {
    return (
        <div style={{ columnWidth: '30em' }} className='w-full px-8 pt-8 pb-12 text-sm'>
            {brandData.references ?
                renderHTMLString("<p class='text-sm opacity-75 first:-mt-3.5'>References</p>" + brandData.references)
                : ''}
            {brandData.importedReferences ?
                brandData.importedReferences.map(refs => {
                    return renderHTMLString("<p class='text-sm opacity-75 mt-6 first:-mt-3.5'>Wikipedia References</p>" + refs)
                }) : ''}
            <div className='hidden first:-mt-3.5'></div>
        </div>
    );
}

async function BrandSummary({ brandData }: { brandData: BrandPageType }) {
    return (
        <div className='relative flex flex-col items-center w-full'>
            <div className='absolute top-0 left-0 right-0 -z-10'> {/* Background Image */}
                {brandData.coverImage ? <Image priority={true} className='w-full !h-auto top-0 object-cover mix-blend-soft-light -z-10 chrome:opacity-40 chrome:xs:opacity-40 chrome:sm:opacity-40 chrome:md:opacity-15 chrome:lg:opacity-15 safari:opacity-80 safari:md:opacity-55 safari:lg:opacity-35' src={brandData.coverImage.url} alt={brandData.coverImage.alt ? brandData.coverImage.alt : ''} fill={true} sizes="100vw" style={{ maskImage: '-webkit-gradient(linear, left 30%, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))' }} /> : ''}
            </div>
            <div className='flex flex-col items-center w-full'> {/* Brand Section */}
                <div className='flex flex-col justify-end w-full md:flex-row flex-nowrap'> {/* Logo & Infocard & Products */}
                    <div className='relative flex items-center justify-center h-full mx-20 mt-10 xs:mx-32 mb-14 md:mx-8 md:my-auto md:w-1/5 md:max-w-lg min-w-32 min-h-32'>
                        <div className='w-full h-full max-h-28 lg:w-3/4 lg:h-3/4'> {/* Logo */}
                            {brandData.logo ? <Image priority={true} className='object-contain drop-shadow-[0_12px_12px_rgba(216,193,172,0.75)]' fill={true} sizes="33vw" src={brandData.logo.url} alt={brandData.name + ' Logo'} /> : ''}
                        </div>
                    </div>
                    <div className='relative flex flex-col items-end justify-start -mt-14 grow md:mt-0 '> {/* Infocard & Products */}
                        <ActionMenu pageName={brandData.name} pageUrlName={brandData.url_name} />
                        <div className=' bg-black flex flex-col md:gap-2 md:flex-row py-3.5 pr-2 pl-4 md:pr-4 md:pl-4 text-tan mx-2 md:mx-0 self-stretch'> {/* Infocard */}
                            <div className='flex flex-row flex-wrap self-start justify-between w-full gap-x-4 md:flex-col justify-self-start md:w-auto md:gap-0'> {/* Title & Industry */}
                                <div className='flex flex-row items-end justify-start mt-0.5'> {/* Title + Icon */}
                                    <p className='text-4xl font-bold tracking-tight whitespace-nowrap md:text-5xl'>{brandData.name}</p>
                                    <IndustryIcon className='block h-7 w-7 md:h-8 md:w-8 mb-1.5 -pt-0.5 md:ml-2 ml-1 ' color='#D8C1AC' name={brandData.industry ? brandData.industry : 'default'} />
                                </div>
                                <div className='mr-2 md:mr-0 md:ml-0.5 mt-0.5 md:-mt-0.25 -mb-0.5'> {/* Industry */}
                                    <p className='text-xl font-medium whitespace-nowrap md:text-2xl md:font-normal'>{renderHTMLString(brandData.industry)}</p>
                                </div>
                            </div>
                            <div className='grow justify-self-end self-end flex flex-col justify-start md:justify-end items-end text-left w-full md:text-right pt-1 pr-2.5 -mt-1 md:mt-0 gap-2 lg:gap-0'> {/* Ownership Structure */}
                                <div className=' md:text-2xl text-base font-normal tracking-wide md:font-medium md:mb-0.5 mb-2.5 w-full md:w-auto'> {/* Owner */}
                                    <span className=' opacity-60'>
                                        {brandData.owner?.indexOf(' ➔ ') != -1 ? renderHTMLString(brandData.owner?.substring(0, brandData.owner.lastIndexOf(' ➔ ') + 2)) : ''}
                                    </span>
                                    <span className=''>
                                        {brandData.owner?.length && brandData.owner?.length > 0 ? ' ☂ ' + renderHTMLString(brandData.owner?.substring(brandData.owner.lastIndexOf(' ➔ ') + 3)) : ''}
                                    </span>
                                </div>
                                <div className='w-full text-base leading-7 tracking-wide md:pl-12 md:text-base md:w-auto'> {/* Brands */}
                                    <div className='md:text-pretty'>{brandData.brands && brandData.brands.length > 0 ? renderHTMLString("<span class=\"opacity-90 bg-tan text-black px-1.5 mr-3 font-medium\">Sub-brands</span>" + brandData.brands) : ''}</div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col-reverse md:flex-row items-start w-full py-3.5 pl-6 md:px-4'> {/* Products */}
                            <div className='absolute top-4 md:top-auto md:relative flex flex-row justify-start justify-self-start gap-0.5 -ml-1 mr-1.5 md:mr-0'> {/* Icons */}
                                <ProductIcons className='h-7 w-7 md:h-8 md:w-8 mr-0.5 mb-3 md:mb-1.5 -mt-0.5' pageName={brandData.name} excludeIndustryName={brandData.industry ? brandData.industry : 'default'} names={brandData.products ? brandData.products.split(' • ') : []} />
                            </div>
                            <div className='w-full text-base font-medium leading-7 tracking-normal text-left md:pl-4 grow md:w-auto justify-self-end md:text-base md:text-right'> {/* Brands */}
                                <div className='md:text-balance pr-2.5 -mt-1'>{brandData.products && brandData.products.length > 0 ? renderHTMLString("<span class=\"opacity-90 bg-black text-tan px-1.5 mr-2.5\">Products</span>" + brandData.products) : ''}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='underline-links w-11/12  max-w-[1800px] flex flex-row -mr-2 md:mr-0 pl-2 md:px-2 pt-6'> {/* Description & Sub-Brand Logos */}
                    <div className='relative w-full text-base brand-content lg:w-2/3 add-text-shadow'> {/* Description */}
                        {/* <div className="absolute opacity-75 bg-tan -z-10 -top-1 -bottom-5 -right-5 -left-5"></div> */}
                        {renderHTMLString(brandData.description)}
                    </div>
                    {/* TODO: Sub-Brand Logos */}
                </div>
            </div>
        </div>
    );

}


function AddReportCard({ pageName, pageUrlName }: { pageName: string, pageUrlName: string }) {
    return (
        <div className='relative h-16 mx-auto mt-12 cursor-pointer w-96'>
            <h2 className='text-2xl -ml-px mt-2 -mb-0.5 font-medium'>Missing something? Add it!</h2>
            <Link href="/policy" className='relative z-10 text-base font-normal cursor-pointer'>Make sure to check our <span className='underline' >report policy</span> first.</Link>
            <Link href={MW_URL + '/wiki/' + pageUrlName + '#Reports'} className='absolute top-0 bottom-0 left-0 right-0 z-00'></Link>
            <Icon className='!absolute right-0 top-0 h-16 w-16 mr-0.5' name='add-page' />
        </div>
    );
}
