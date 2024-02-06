import { ADD_BRAND_URL, BrandPage, REPORT_TYPES, ReportPage } from '../../../lib/definitions'
import { Suspense } from 'react'
import Image from 'next/image'
import { Icon } from '@/app/lib/icons/ui-icons';
import { IndustryIcon } from '@/app/lib/icons/dynamicIcons';
import { fetchBrandPage, fetchReportPages, searchBrands } from '@/app/lib/mediawiki';
import Link from 'next/link';
import { LoadingBrandItem, LoadingReportItem, LoadingSearchRow } from './loading';


export default async function SearchResults({ searchQuery, pageNumber = 0, resultCount = 10, styles = ""}: {searchQuery: string, pageNumber?:number, resultCount?:number, styles?: string, debug?: boolean }) {
    const searchResponse = await searchBrands({query:searchQuery, resultCount:resultCount, resultPage:pageNumber});

    if (searchResponse === undefined || searchResponse.length < 1) {
      return (
        <NoResultsFound query={searchQuery} />
      );
    }
    return (
      <div className={'flex flex-col items-center justify-start w-full mb-8'+styles}>
        {searchResponse.map((item) => {
          return (
          <Suspense fallback={LoadingSearchRow()}>
            <SearchResultRow key={item} brandName={item}></SearchResultRow>
          </Suspense>
          )
          })}
      </div>
    );
  }

  async function SearchResultRow({brandName}:{brandName:string}){
    const brandData = await fetchBrandPage(brandName);

    return (
      <div className='h-52 overflow-y-hidden w-full relative'>

          <Link href={"/b/"+brandData.title} className='z-20 opacity-0 hover:opacity-100 flex absolute left-0 top-0 right-0 bottom-1.5 items-center justify-center'>
            <div className=' w-64'> </div>
            <div className=' flex-grow flex justify-center items-center'> 
              <div className=' relative flex flex-row items-center justify-center'>
                <p className='z-30 text-3xl font-medium relative mr-1'>See More</p>
                <Icon styles=' z-30 w-20 h-20' name='right-arrow'/>
                <div className='z-20 bg-tan rounded-full blur-lg -my-2 -mx-12 absolute top-0 bottom-0 left-0 right-0'></div>
              </div>
            </div>
          </Link>

        <div className='flex flex-wrap justify-start items-stretch content-stretch w-full'>

          <Suspense fallback={LoadingBrandItem()}>
            {brandData ? (<BrandSearchItem brandData={brandData}/>) : ''}
          </Suspense>
          {(brandData.reportNames) ? (brandData.reportNames.map(reportName => (<Suspense key={reportName} fallback={LoadingReportItem()}>
            <ReportSearchItem key={reportName} reportName={reportName}/>
          </Suspense>))) : ''}
          
        </div>
      </div>
    );
  }


export const SEARCH_ITEM_STYLES = ' shrink-0 h-52 grow relative max-w-128 text-xl font-medium first:-ml-1.5 last:-mr-1.5 min-w-64 ';
  async function BrandSearchItem({brandData}:{brandData:BrandPage}) {
    return (
      <div className={SEARCH_ITEM_STYLES+' border-x-black border-x-6 border-b-black border-b-6 text-xl font-medium flex flex-col'}>
        <div className='relative h-full w-full flex justify-center items-center overflow-hidden bg-tan'>
          <div className='flex-item relative min-w-8 w-32 h-32 z-10'>
            {brandData.logo ? <Image className='object-contain' fill={true} sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw" src={brandData.logo.url} alt={brandData.logo.alt ? brandData.logo.alt : ''} /> : ''}
          </div>
          {brandData.coverImage ? <Image className='object-cover mix-blend-soft-light' src={brandData.coverImage.url} alt={brandData.coverImage.alt ? brandData.coverImage.alt : ''} fill={true} sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw"/> : ''}
        </div>
        <div className='h-11 bg-black text-tan text-xl font-medium relative flex justify-center items-center -pl-1.5 -pb-1.5 -pr-1.5 -bottom-1.5'>
          <p className=' text-center'>
            {brandData.title}
          </p>
          <div className='absolute left-0 top-0 bottom-0 w-10 my-0.5 p-0.5 pb-1'>
            <IndustryIcon styles='' color='#D8C1AC' name={brandData.industry ? brandData.industry : 'default'}/>
          </div>
        </div>
      </div>
    );
  }

  async function ReportSearchItem({reportName}:{reportName:string}) {
    const [reportData] = await fetchReportPages([reportName]);

    return (
      <div className={SEARCH_ITEM_STYLES+' border-r-black border-r-6 border-b-black border-b-6 relative overflow-hidden text-ellipsis'}>
        <div className='flex flex-col absolute bottom-0 top-0 left-0'>
          <div className='flex flex-row flex-nowrap h-min justify-start pt-2.5'>
            <div className='block justify-self-start pl-2.5 pr-1.5'>
              <p className='text-l font-medium line-clamp-3 leading-tight'>{reportData.title.substring(1+reportData.title.indexOf('/'))}</p>
            </div>
            
            <div className={'justify-self-end w-14 h-14 p-1 shrink-0 -mt-0.5 mr-2 '+REPORT_TYPES[reportData.type].color}>
              <Icon styles={REPORT_TYPES[reportData.type].iconStyle} name={REPORT_TYPES[reportData.type].icon} color="#D8C1AC" />
            </div>
          </div>
          <div className='mx-2.5 mt-1.5 mb-3 pb-0.5 h-full flex flex-col overflow-hidden'>
              <p className='flex-1 overflow-hidden text-ellipsis leading-snug text-sm font-normal'>{reportData.preview}</p>
          </div>
        </div>
      </div>
    );
  }

  function NoResultsFound({query}:{query:string}) {

    return (
      <div className='flex flex-col w-full justify-center items-center p-16 text-center'>
          <Icon styles='w-28 h-28 mb-4 opacity-60' name='no-results' />
          <p className='text-3xl font-medium opacity-75'>Couldn't find anything for '{query}' </p>
          <p className='text-xl font-medium opacity-60'>Searched all brands, products, and industries.</p>
          <a target="_blank" rel="noopener noreferrer" href={ADD_BRAND_URL} className='text-xl mt-14 font-medium opacity-75 text-center'>Are we missing a brand? <span className='underline underline-offset-1'>Add it here!</span></a>
      </div>
    )
  }