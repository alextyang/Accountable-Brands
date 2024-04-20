import { Icon } from "@/app/lib/icons/interfaceIcons";
import React from "react";

const classNames = {
  header: '-mt-1 text-xl font-medium md:text-2xl lg:text-xl mb-0.5 md:mb-1 lg:mb-0.5 whitespace-nowrap',
  body: 'text-lg md:text-xl lg:text-base whitespace-nowrap'
};

export function CrowdsourcedExplainer({ }) {
  return (
    <div className="relative flex flex-col items-center w-full p-4 mt-16 text-tan">
      <div className="absolute top-0 bottom-0 bg-black -z-10 -left-64 -right-64"></div>
      <div className="flex flex-row items-center justify-center gap-3">
        <Icon className="h-14 w-14 -scale-x-100 !block" name="contributors" color="rgb(216 193 172)" />
        <p className="-mt-1 text-xl font-medium xs:text-2xl whitespace-nowrap">Created by Contributors</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 mt-8 mb-6 lg:flex-row lg:gap-2">
        <div className="flex flex-col items-center justify-center pl-2">
          <Icon className="h-24 mb-1 lg:h-32" name="edit-page" color="rgb(216 193 172)" />
          <p className={classNames.header}>
            User-Submitted Content
          </p>
          <p className={classNames.body}>
            Anyone can create and edit brand
          </p>
          <p className={classNames.body}>listings and reports.</p>
        </div>
        <StepArrow />
        <div className="flex flex-col items-center justify-center">
          <Icon className="h-24 lg:h-32 p-1.5 mb-1" name="peer-review" color="rgb(216 193 172)" />
          <p className={classNames.header}>
            Mandatory Peer-Approval
          </p>
          <p className={classNames.body}>
            Every submission is reviewed for policy
          </p>
          <p className={classNames.body}>compliance & integrity.</p>
        </div>
        <StepArrow />
        <div className="flex flex-col items-center justify-center">
          <Icon className="h-24 p-2 mb-1 lg:h-32" name="publish" color="rgb(216 193 172)" />
          <p className={classNames.header}>
            All Published Here
          </p>
          <p className={classNames.body}>
            Added to brand pages and the search
          </p>
          <p className={classNames.body}>
            engine, with each citation mirrored.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepArrow({ }) {
  return (<Icon className="w-16 h-16 mt-2 -mb-0.5 rotate-90 lg:m-0 lg:rotate-0" name="right-arrow" color="rgb(216 193 172)" />);
}
