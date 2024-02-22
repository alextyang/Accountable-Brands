import { IconMark } from "@/app/lib/assets/logos";
import React from "react";
export function MissionStatement({}) {
  return (
    <div className="relative flex mb-24 mt-8 md:mt-10 max-w-screen-md flex-col text-center w-auto">
      <IconMark
        className="h-12 flex items-center justify-center mr-4 mb-4"
        isLink={false}
      />

      {/* Large format statement */}
      <p
        style={{
          lineHeight: "1.35",
        }}
        className="md:inline font-medium text-3xl tracking-tight hidden"
      >
        <span className="inline whitespace-nowrap">
          An open-source platform to empower employees &
        </span>{" "}
        <span className="inline whitespace-nowrap">
          consumers by{" "}
          <span className="bg-black px-1.5 relative pb-px text-tan">
            fighting the monopoly on information
            <span className="pl-0">.</span>
          </span>
        </span>
      </p>

      {/* Medium format statement */}
      <p
        style={{
          lineHeight: "1.35",
        }}
        className=" font-medium text-3xl tracking-tight hidden sm:inline md:hidden"
      >
        <span className="inline whitespace-nowrap">
          An open-source platform to
        </span>{" "}
        <span className="inline whitespace-nowrap">
          empower consumers & employees by
        </span>{" "}
        <span className="inline-block whitespace-nowrap mt-1.5">
          {" "}
          <span className="bg-black px-1.5 relative pb-px text-tan">
            fighting the monopoly on information
            <span className="pl-0">.</span>
          </span>
        </span>
      </p>

      {/* Medium format statement */}
      <p
        style={{
          lineHeight: "1.35",
        }}
        className=" font-medium text-2xl pt-2 tracking-tight inline sm:hidden"
      >
        <span className="inline whitespace-nowrap">
          An open-source platform to
        </span>{" "}
        <span className="inline whitespace-nowrap">
          empower consumers & employees
        </span>{" "}
        <span className="inline-block whitespace-nowrap mt-1.5">
          {" "}
          <span className="bg-black px-1.5 relative pb-px text-tan">
            fighting the monopoly on information
            <span className="pl-0">.</span>
          </span>
        </span>
      </p>
    </div>
  );
}
