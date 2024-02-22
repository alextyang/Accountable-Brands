import { Faq } from "./(about)/faq";
import { CrowdsourcedExplainer } from "./(about)/crowdsourcedExplainer";
import { ReportExplainer } from "./(about)/reportExplainer";
import { MissionStatement } from "./(about)/missionStatement";
import { Icon } from "@/app/lib/icons/ui-icons";
import React from "react";

export function AboutSection({}) {
  return (
    <div className=" flex flex-col justify-start items-center w-full -mt-14">
      <MissionStatement />
      <ReportExplainer />
      <CrowdsourcedExplainer />
      <Faq />
    </div>
  );
}
