import { ReactNode } from "react"
import { SEARCH_ITEM_STYLES } from "./searchResults"

export default function LoadingSearchResults() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className='flex flex-wrap justify-start items-stretch content-stretch w-full'>
            <LoadingSearchRow />
            <LoadingSearchRow />
            <LoadingSearchRow />
            <LoadingSearchRow />
            <LoadingSearchRow />
        </div>
    )
  }

  export function LoadingSearchRow() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className='h-52 overflow-y-hidden w-full relative'>
            <div className='flex flex-wrap justify-start items-stretch content-stretch w-full'>
                <BrandItemSkeleton/>
                <ReportItemSkeleton/>
                <ReportItemSkeleton/>
                <ReportItemSkeleton/>
                <ReportItemSkeleton/>
                <ReportItemSkeleton/>
            </div>
        </div>
    )
  }

  export function LoadingBrandItem() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
            <BrandItemSkeleton/>
    )
  }

  export function LoadingReportItem() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <ReportItemSkeleton/>)
  }

  function ReportItemSkeleton() {
    return (
        <div className={SEARCH_ITEM_STYLES+'min-w-48 border-r-black border-r-6 border-b-black border-b-6 relative overflow-hidden text-ellipsis skeleton-wrap'} style={{animationDelay: '200ms'}}>
        <div className='flex flex-col w-full absolute bottom-0 top-0 left-0'>
          <div className='flex flex-row w-full flex-nowrap h-min justify-stretch pt-2.5'>
            <div className='block grow justify-self-start pl-3 pr-2.5'>
              <div className='text-lg font-medium line-clamp-3 leading-tight skeleton opacity-60' style={{animationDelay: '400ms'}}></div>
            </div>
            
            <div className={'justify-self-end w-14 h-14 p-1 shrink-0 -mt-0.5 mr-2 skeleton opacity-60'} style={{animationDelay: '600ms'}}>
              <div color="#D8C1AC" />
            </div>
          </div>
          <div className='ml-3 mr-2 mt-3.5 mb-3 pb-0.5 h-full flex flex-col overflow-hidden opacity-40 skeleton' style={{animationDelay: '800ms'}}>
              <p className='flex-1 overflow-hidden text-ellipsis leading-snug text-sm font-normal skeleton-body'></p>
          </div>
        </div>
      </div>
      
    )
  }

  function BrandItemSkeleton() {
    return (
        <div className={SEARCH_ITEM_STYLES+'min-w-48 border-x-black border-x-6 border-b-black border-b-6 text-xl font-medium flex flex-col skeleton-wrap'}>
        <div className='relative h-full flex justify-center items-center overflow-hidden '>
          <div className='flex-item relative min-w-8 w-32 h-32 z-10 opacity-40'>
            <div className='object-contain skeleton m-auto mt-2 w-3/4 h-3/4' style={{animationDelay: '200ms'}} />
          </div>
        </div>
        <div className='h-11 bg-black text-xl font-medium relative flex justify-center items-center -pl-1.5 -pb-1.5 -pr-1.5 -bottom-1.5 skeleton opacity-60' style={{animationDelay: '800ms'}}>
          <p className='text-base text-center skeleton opacity-100' style={{animationDelay: '400ms'}}>
          </p>
          <div className='absolute left-0 top-0 bottom-0 w-10 my-0.5 p-0.5 pb-1 '>
            <div className='skeleton skeleton-icon opacity-100' style={{animationDelay: '600ms'}} color='#D8C1AC'/>
          </div>
        </div>
      </div>
      
    )
  }