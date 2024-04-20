import { BrandSearchIcon } from "@/app/lib/icons/customIcons";
import { REPORT_TYPES } from "@/app/lib/definitions";
import { Icon, IconName } from "@/app/lib/icons/interfaceIcons";
import React from "react";
export function ReportExplainer({ }) {
  return (
    <>
      <Icon
        className="w-24 h-24 mt-px mb-12 opacity-30"
        name="search-document"
      />
      <ExampleReports />
      <ReportArrows />
      <ReportDefinition />
      <Icon className="w-24 h-24 rotate-90 mt-9 opacity-30" name="link" />
      <BrandDefinition />
    </>
  );
}

function ExampleReportType({ number }: { number: string }) {
  return (
    <div className={"px-1.5 flex flex-row w-full max-w-md py-3 xs:py-1.5 " + REPORT_TYPES[number].color} >
      <Icon
        className={"h-16 w-16 ml-1.5 shrink-0" + REPORT_TYPES[number].iconStyle}
        name={REPORT_TYPES[number].icon as IconName}
        color="rgb(216 193 172)"
      />
      <div className="flex flex-col items-start justify-center pr-5 ml-3 text-left text-tan sm:whitespace-nowrap shrink">
        <h1 className="font-medium -mt-px text-lg xs:text-xl sm:text-2xl -pl-px tracking-[-0.025em] leading-6 mb-1.5 sm:mb-0.5">
          {REPORT_TYPES[number].longname}
        </h1>
        <p className="-mt-1 text-sm font-base sm:text-base">
          {REPORT_TYPES[number].examples}
        </p>
      </div>
    </div>
  );
}

function ExampleReports({ }) {
  return (
    <>
      <ExampleReportType number="Anti-Consumer Tactics" />
      <div className="flex flex-col items-center w-full max-w-screen-xl gap-10 mt-10 lg:mt-8 lg:gap-32 lg:flex-row lg:justify-around ">
        <ExampleReportType number="Political Profits" />
        <ExampleReportType number="Human Rights Abuse" />
      </div>
    </>
  );
}

function ReportArrows({ }) {
  return (
    <div className="flex flex-row justify-center w-full max-w-screen-xl gap-20 mt-8 mb-4 lg:mt-2 lg:mb-0 lg:px-24">
      <Icon
        className="w-24 p-1 hidden lg:inline lg:rotate-[45deg]"
        name="right-arrow"
      />
      <Icon className="w-24 p-1 -mt-2 rotate-90 lg:-mt-36" name="right-arrow" />
      <Icon
        className="w-24 p-1 hidden lg:inline lg:rotate-[135deg]"
        name="right-arrow"
      />
    </div>
  );
}

function ReportDefinition({ }) {
  return (
    <>
      <div className="flex flex-row items-baseline justify-center mt-0 lg:-mt-12">
        <Icon
          className="h-24 w-24 pb-1.5 pt-2.5 -mr-5 opacity-60"
          name="brand-report"
        />
        <Icon className="w-32 h-32" name="brand-report" />
        <Icon
          className="h-24 w-24 pb-1.5 pt-2.5 -ml-5 opacity-60"
          name="brand-report"
        />
      </div>
      <h1 className="text-3xl font-medium mb-0.5">Reports</h1>
      <p className="mt-1 text-xl font-base mb-0.5 leading-snug">Crucial journalism,
        kept in a <br className="hidden xs:inline" /> <span className="font-medium">permanent, open-source</span>{" "}
        record.
      </p>
    </>
  );
}

function BrandDefinition({ }) {
  return (
    <>
      <BrandSearchIcon className="w-32 h-32 -mr-3 mt-9" />
      <h1 className="-mt-2 text-3xl font-medium">Brands</h1>
      <p className="mt-1 text-xl leading-snug font-base">
        Get the <span className="font-medium">sincere truth</span> about an
        organization, <br className="hidden xs:inline" /> before you buy, donate, or work there.
      </p>
    </>
  );
}
