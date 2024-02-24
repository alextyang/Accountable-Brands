import { ReactNode } from "react";

const SEARCH_ITEM_CLASSNAME = 'col-span-1 justify-self-stretch relative h-52 text-xl font-medium first:-ml-1.5 min-w-64';

export default function LoadingSearchResults() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col items-center justify-start w-full mb-8">
      <LoadingSearchRow />
      <LoadingSearchRow />
      <LoadingSearchRow />
      <LoadingSearchRow />
      <LoadingSearchRow />
    </div>
  );
}

export function LoadingSearchRow() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="relative w-full overflow-y-visible h-52">
      <div className="grid grid-flow-col justify-stretch justify-items-start grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 -mr-1.5">
        <BrandItemSkeleton />
        <ReportItemSkeleton index={0} />
        <ReportItemSkeleton index={1} />
        <ReportItemSkeleton index={2} />
        <ReportItemSkeleton index={3} />
      </div>
    </div>
  );
}

export function LoadingReports() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
        <><ReportItemSkeleton index={0} /><ReportItemSkeleton index={1} /><ReportItemSkeleton index={2} /><ReportItemSkeleton index={3} /></>
  );
}

export function LoadingBrandItem() {
  // You can add any UI inside Loading, including a Skeleton.
  return <BrandItemSkeleton />;
}

export function LoadingReportItem({index}:{index:number}) {
  // You can add any UI inside Loading, including a Skeleton.
  return <ReportItemSkeleton index={index} />;
}

function ReportItemSkeleton({index}:{index:number}) {
  var className = "";
  if (index == 0) className = 'hidden xs:block';
  else if (index == 1) className = 'hidden lg:block';
  else if (index == 2) className = 'hidden xl:block';
  else if (index == 3) className = 'hidden 2xl:block';

  return (
    <div
      className={
        SEARCH_ITEM_CLASSNAME +
        " min-w-48 border-r-black border-r-6 border-b-black border-b-6  relative overflow-x-hidden overflow-y-visible text-ellipsis skeleton-wrap " + className
      }
      style={{ animationDelay: "200ms" }}
    >
      <div className="absolute top-0 bottom-0 left-0 flex flex-col w-full">
        <div className="flex flex-row w-full flex-nowrap h-min justify-stretch pt-2.5">
          <div className="block grow justify-self-start pl-3 pr-2.5">
            <div
              className="text-lg font-medium leading-tight line-clamp-3 skeleton opacity-60"
              style={{ animationDelay: "400ms" }}
            ></div>
          </div>

          <div
            className={
              "justify-self-end w-14 h-14 p-1 shrink-0 -mt-0.5 mr-2 skeleton opacity-60"
            }
            style={{ animationDelay: "600ms" }}
          >
            <div color="#D8C1AC" />
          </div>
        </div>
        <div
          className="ml-3 mr-2 mt-3.5 mb-3 pb-0.5 h-full flex flex-col overflow-hidden opacity-40 skeleton"
          style={{ animationDelay: "800ms" }}
        >
          <p className="flex-1 overflow-hidden text-sm font-normal leading-snug text-ellipsis skeleton-body"></p>
        </div>
      </div>
    </div>
  );
}

function BrandItemSkeleton() {
  return (
    <div
      className={
        SEARCH_ITEM_CLASSNAME +
        "min-w-48 border-x-black border-x-6 border-b-black border-b-6 text-xl font-medium flex flex-col skeleton-wrap"
      }
    >
      <div className="relative flex items-center justify-center h-full overflow-hidden ">
        <div className="relative z-10 w-32 h-32 flex-item min-w-8 opacity-40">
          <div
            className="object-contain w-3/4 m-auto mt-2 skeleton h-3/4"
            style={{ animationDelay: "200ms" }}
          />
        </div>
      </div>
      <div
        className="h-11 bg-black text-xl font-medium relative flex justify-center items-center -pl-1.5 -pb-1.5 -pr-1.5 -bottom-1.5 skeleton opacity-60"
        style={{ animationDelay: "800ms" }}
      >
        <p
          className="text-base text-center opacity-100 skeleton"
          style={{ animationDelay: "400ms" }}
        ></p>
        <div className="absolute left-0 top-0 bottom-0 w-10 my-0.5 p-0.5 pb-1 ">
          <div
            className="opacity-100 skeleton skeleton-icon"
            style={{ animationDelay: "600ms" }}
            color="#D8C1AC"
          />
        </div>
      </div>
    </div>
  );
}
