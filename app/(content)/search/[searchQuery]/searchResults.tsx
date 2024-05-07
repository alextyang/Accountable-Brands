import { ADD_BRAND_URL, ParsedBrandPage, REPORT_TYPES, ParsedReportPage } from '../../../data/definitions'
import { Suspense } from 'react'
import Image from 'next/image'
import { Icon, IconName } from '@/app/media/icons/interfaceIcons';
import { fetchBrandPage, fetchReportPages, searchBrands } from '@/app/data/mediawiki';
import Link from 'next/link';
import { LoadingBrandItem, LoadingReportItem, LoadingReports, LoadingSearchRow } from './loading';
import { IndustryIcon } from '@/app/media/utils/iconPicker/iconComponents';


export default async function SearchResults({ searchQuery, pageNumber = 0, resultCount = 10, className = "" }: { searchQuery: string, pageNumber?: number, resultCount?: number, className?: string, debug?: boolean }) {
  const searchResponse = await searchBrands({ query: searchQuery, resultCount: resultCount, resultPage: pageNumber });

  if (searchResponse === undefined || searchResponse.length < 1) {
    return (
      <NoResultsFound query={searchQuery} />
    );
  }
  return (
    <div className={'flex flex-col items-center justify-start w-full mb-8' + className}>
      {searchResponse.map((item, index) => {
        return (
          <Suspense key={item} fallback={<LoadingSearchRow />}>
            <SearchResultRow key={item} brandName={item} rowIndex={index}></SearchResultRow>
          </Suspense>
        )
      })}
    </div>
  );
}

async function SearchResultRow({ brandName, rowIndex }: { brandName: string, rowIndex: number }) {
  const brandData = await fetchBrandPage(brandName);

  if (brandData.status == 'failed')
    return '';

  //TODO Intelligent report sorting
  brandData.reportNames.splice(4);

  return (
    <div className='relative w-full h-52'>

      <Link href={"/b/" + brandData.url_name} className='z-20 opacity-0 hover:opacity-100 flex absolute left-0 top-0 right-0 bottom-1.5 items-center justify-center'>
        <div className='w-0 sm:w-64'> </div>
        <div className='flex items-center justify-center flex-grow '>
          <div className='relative flex flex-row items-center justify-center '>
            <p className='relative z-30 mr-1 text-3xl font-medium'>See More</p>
            <Icon className='z-30 w-20 h-20 ' name='right-arrow' />
            <div className='absolute top-0 bottom-0 left-0 right-0 z-20 -mx-12 -my-2 rounded-full bg-tan blur-lg'></div>
          </div>
        </div>
      </Link>

      <div className={'grid grid-flow-col justify-stretch justify-items-start grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 -mr-1.5 overflow-visible'}>

        <Suspense fallback={LoadingBrandItem()}>
          {brandData ? (<BrandSearchItem brandData={brandData} index={rowIndex} />) : ''}
        </Suspense>
        <Suspense fallback={LoadingReports()}>
          {(brandData.reportNames) ? (brandData.reportNames.map((reportName, reportIndex) => (
            <ReportSearchItem key={reportName} reportName={reportName} index={reportIndex} />
          ))) : ''}
        </Suspense>

      </div>
    </div>
  );
}


const SEARCH_ITEM_className = 'col-span-1 justify-self-stretch h-52 relative  text-xl font-medium first:-ml-1.5 min-w-64 '; // max-w-128
async function BrandSearchItem({ brandData, index }: { brandData: ParsedBrandPage, index: number }) {
  return (
    <div className={SEARCH_ITEM_className + ' border-x-black border-x-6 border-b-black border-b-6 text-xl font-medium flex flex-col'}>

      <div className='relative h-full w-full flex justify-center items-center bg-tan -mb-1.5 p-6'>
        <div className='relative z-10 w-full h-full flex-item min-w-8 max-w-64 max-h-32'>
          {brandData.logo ? <Image className='object-contain' fill={true} sizes="(max-width: 768px) 33vw, (max-width: 1200px) 33vw" src={brandData.logo.url} priority={index < 6} alt={brandData.name + ' Logo'} /> : ''}
        </div>
        {brandData.coverImage ? <Image className='object-cover opacity-75 mix-blend-soft-light' src={brandData.coverImage.url} alt={brandData.coverImage.alt ? brandData.coverImage.alt : ''} fill={true} priority={index < 6} sizes="(max-width: 520px) 50vw, (max-width: 768px) 33vw" /> : ''}
      </div>
      <div className='h-11 bg-black text-tan text-xl font-medium relative flex justify-center items-center -pl-1.5 -pb-1.5 -pr-1.5 -bottom-1.5'>
        <p className='text-center '>
          {brandData.name}
        </p>
        <div className='absolute left-0 top-0 bottom-0 w-10 my-0.5 p-0.5 pb-1'>
          <IndustryIcon className='' color='#D8C1AC' name={brandData.industry ? brandData.industry : 'default'} />
        </div>
      </div>
    </div>
  );
}

async function ReportSearchItem({ reportName, index }: { reportName: string, index?: number }) {
  const [reportData] = await fetchReportPages([reportName]);
  var className = "";
  if (index == 0) className = 'hidden xs:block';
  else if (index == 1) className = 'hidden lg:block';
  else if (index == 2) className = 'hidden xl:block';
  else if (index == 3) className = 'hidden 2xl:block';

  return (
    <div className={SEARCH_ITEM_className + ' border-r-black border-r-6 border-b-black border-b-6 relative ' + className}>
      <div className="absolute -top-1.5 -left-[0.35rem] -right-[0.35rem] border-t-6 h-2 border-x-6 border-x-black border-t-black z-10"></div>
      <div className='absolute top-0 bottom-0 left-0 flex flex-col overflow-visible text-ellipsis'>
        <div className='flex flex-row flex-nowrap h-min justify-start pt-2.5'>
          <div className='block justify-self-start pl-2.5 pr-1.5'>
            <p className='font-medium leading-tight text-l line-clamp-3'>{reportData.title.substring(1 + reportData.title.indexOf('/'))}</p>
          </div>

          <div className={'justify-self-end w-14 h-14 p-1 shrink-0 -mt-0.5 mr-2 ' + REPORT_TYPES[reportData.type].color}>
            <Icon className={REPORT_TYPES[reportData.type].iconStyle} name={REPORT_TYPES[reportData.type].icon as IconName} color="#D8C1AC" />
          </div>
        </div>
        <div className='mx-2.5 mt-1.5 mb-3 pb-0.5 h-full flex flex-col overflow-hidden'>
          <p className='flex-1 overflow-hidden text-sm font-normal leading-snug text-ellipsis'>{reportData.preview}</p>
        </div>
      </div>
    </div>
  );
}

function NoResultsFound({ query }: { query: string }) {

  return (
    <div className='flex flex-col items-center justify-center w-full p-16 text-center'>
      <Icon className='mb-4 w-28 h-28 opacity-60' name='no-results' />
      <p className='text-3xl font-medium opacity-75'>Couldn&apos;t find anything for &apos;{query}&apos; </p>
      <p className='text-xl font-medium opacity-60'>Searched all brands, products, and industries.</p>
      <a target="_blank" rel="noopener noreferrer" href={ADD_BRAND_URL} className='text-xl font-medium text-center opacity-75 mt-14'>Are we missing a brand? <span className='underline underline-offset-1'>Add it here!</span></a>
    </div>
  )
}