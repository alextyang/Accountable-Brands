import BrandSearchIcon from "@/app/lib/assets/brandSearchIcon";
import { REPORT_TYPES } from "@/app/lib/definitions";
import { Icon } from "@/app/lib/icons/ui-icons";
import React from "react";
export function ReportExplainer({}) {
  return (
    <>
      {/* Report Types */}
      <Icon
        className="h-24 w-24 mb-12 mt-px opacity-30"
        name="search-document"
      />
      <ExampleReportType number="Anti-Consumer Tactics" />
      <div className="max-w-screen-xl mt-10 lg:mt-8 gap-10 lg:gap-32 w-full flex flex-col lg:flex-row lg:justify-around items-center ">
        <ExampleReportType number="Political Profits" />
        <ExampleReportType number="Human Rights Abuse" />
      </div>

      {/* Arrows */}
      <div className="flex flex-row justify-center gap-20 mt-8 lg:mt-2 mb-4 lg:mb-0 max-w-screen-xl w-full lg:px-24">
        <Icon
          className="w-24 p-1 hidden lg:inline lg:rotate-[45deg]"
          name="right-arrow"
        />
        <Icon
          className="w-24 p-1 rotate-90 -mt-2 lg:-mt-36"
          name="right-arrow"
        />
        <Icon
          className="w-24 p-1 hidden lg:inline lg:rotate-[135deg]"
          name="right-arrow"
        />
      </div>

      {/* Reports */}
      <div className="flex flex-row justify-center items-baseline mt-0 lg:-mt-12">
        <Icon
          className="h-24 w-24 pb-1.5 pt-2.5 -mr-5 opacity-60"
          name="brand-report"
        />
        <Icon className="h-32 w-32" name="brand-report" />
        <Icon
          className="h-24 w-24 pb-1.5 pt-2.5 -ml-5 opacity-60"
          name="brand-report"
        />
      </div>
      <h1 className="font-medium text-3xl">Reports</h1>
      <p className="font-base text-xl mt-1">All this crucial journalism,</p>
      <p className="font-base text-xl -mt-1 mb-0.5">
        kept in a <span className="font-medium">permanent, open-source</span>{" "}
        record.
      </p>

      {/* Brands */}
      <Icon className="h-24 w-24 mt-9 opacity-30 rotate-90" name="link" />
      <BrandSearchIcon className="h-32 w-32  -mr-3 mt-9" />
      <h1 className="font-medium text-3xl -mt-2">Brands</h1>
      <p className="font-base text-xl mt-1">
        Get the <span className="font-medium">sincere truth</span> about an
        organization,
      </p>
      <p className="font-base text-xl -mt-1">
        before you buy, donate, or work.
      </p>
    </>
  );
}

function ExampleReportType({ number }: { number: string }) {
  return (
    <div
      className={
        "p-1.5 flex flex-row w-full max-w-md " + REPORT_TYPES[number].color
      }
    >
      <Icon
        className={"h-16 w-16 ml-1.5 " + REPORT_TYPES[number].iconStyle}
        name={REPORT_TYPES[number].icon}
        color="rgb(216 193 172)"
      />
      <div className="text-tan ml-3 pr-5 whitespace-nowrap flex flex-col justify-center items-start">
        <h1 className="font-medium -mt-px text-2xl -pl-px tracking-[-0.025em]">
          {REPORT_TYPES[number].longname}
        </h1>
        <p className="font-base -mt-1 text-base">
          {REPORT_TYPES[number].examples}
        </p>
      </div>
    </div>
  );
}
