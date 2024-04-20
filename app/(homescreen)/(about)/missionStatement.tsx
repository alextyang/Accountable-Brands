import { LetterMark } from "@/app/lib/branding/branding";
import React from "react";
export function MissionStatement({ }) {
  return (
    <div className="relative flex flex-col w-auto max-w-screen-md mt-8 mb-24 text-center md:mt-10">
      <LetterMark
        className="flex items-center justify-center h-12 mb-4 mr-4"
        isLink={false}
      />

      {/* Large format statement */}
      <p
        style={{
          lineHeight: "1.35",
        }}
        className="hidden text-3xl font-medium tracking-tight md:inline"
      >
        <span className="inline whitespace-nowrap">
          An open-source platform, empowering employees &
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
        className="hidden text-3xl font-medium tracking-tight sm:inline md:hidden"
      >
        <span className="inline whitespace-nowrap">
          An open-source platform,
        </span>{" "}
        <span className="inline whitespace-nowrap">
          empowering consumers & employees by
        </span>{" "}
        <span className="inline-block whitespace-nowrap mt-1.5">
          {" "}
          <span className="bg-black px-1.5 relative pb-px text-tan">
            fighting the monopoly on information
            <span className="pl-0">.</span>
          </span>
        </span>
      </p>

      {/* Small format statement */}
      <p
        style={{
          lineHeight: "1.35",
        }}
        className="hidden pt-2 text-2xl font-medium tracking-tight xs:inline sm:hidden"
      >
        <span className="inline whitespace-nowrap">
          An open-source platform,
        </span>{" "}
        <span className="inline whitespace-nowrap">
          empowering consumers & employees by
        </span>{" "}
        <span className="inline-block whitespace-nowrap mt-1.5">
          {" "}
          <span className="bg-black px-1.5 relative pb-px text-tan">
            fighting the monopoly on information
            <span className="pl-0">.</span>
          </span>
        </span>
      </p>

      {/* XS format statement */}
      <p
        style={{
          lineHeight: "1.35",
        }}
        className="inline-block pt-2 text-2xl font-medium tracking-tight xs:hidden"
      >
        <span className="inline whitespace-nowrap">
          An open-source platform,
        </span>{" "}
        <span className="inline whitespace-nowrap">empowering consumers &</span>{" "}
        <span className="inline-block whitespace-nowrap">
          employees by{" "}
          <span className="relative px-1 pb-px bg-black text-tan">
            fighting the
          </span>
        </span><br />
        <span className="inline-block px-1 pb-px mt-1 bg-black whitespace-nowrap text-tan">
          corporate monopoly on
        </span>
        <br />
        <span className="inline-block px-1 pb-px mt-1 bg-black whitespace-nowrap text-tan">
          information
          <span className="pl-0">.</span>
        </span>
      </p>
    </div>
  );
}
