import { Faq } from "./(about)/faq";
import { CrowdsourcedExplainer } from "./(about)/crowdsourcedExplainer";
import { ReportExplainer } from "./(about)/reportExplainer";
import { MissionStatement } from "./(about)/missionStatement";
import React from "react";

export function AboutSection({ }) {
  return (
    <div className="flex flex-col items-center justify-start w-full text-center -mt-14">
      <MissionStatement />
      <ReportExplainer />
      <CrowdsourcedExplainer />
      <Faq />
    </div>
  );
}
