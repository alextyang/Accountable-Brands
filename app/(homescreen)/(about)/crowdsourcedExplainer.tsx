import { Icon } from "@/app/lib/icons/ui-icons";
import React from "react";
export function CrowdsourcedExplainer({}) {
  return (
    <div className="w-full relative p-4  flex flex-col items-center text-tan mt-16">
      <div className="bg-black -z-10 absolute top-0 bottom-0 -left-64 -right-64"></div>
      <div className="flex flex-row gap-3 items-center justify-center">
        <Icon
          className="h-14 w-14 -scale-x-100 !block"
          name="contributors"
          color="rgb(216 193 172)"
        />
        <p className="text-2xl font-medium -mt-1">Created by Contributors</p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center mt-8 mb-6">
        <div className="flex flex-col items-center justify-center pl-2">
          <Icon
            className="h-24 md:h-32 mb-1"
            name="edit-page"
            color="rgb(216 193 172)"
          />
          <p className="lg:text-xl md:text-base text-sm font-medium -mt-1 whitespace-nowrap">
            User-Submitted Content
          </p>
          <p className="text-sm whitespace-nowrap">
            Anyone can create and edit brand
          </p>
          <p className="text-sm whitespace-nowrap">listings and reports.</p>
        </div>
        <Icon
          className="h-16 w-16 rotate-90 md:rotate-0"
          name="right-arrow"
          color="rgb(216 193 172)"
        />
        <div className="flex flex-col items-center justify-center">
          <Icon
            className="h-24 md:h-32 p-1.5 mb-1"
            name="peer-review"
            color="rgb(216 193 172)"
          />
          <p className="lg:text-xl md:text-base text-sm font-medium -mt-1 whitespace-nowrap">
            Mandatory Peer-Approval
          </p>
          <p className="text-sm whitespace-nowrap">
            Every submission is reviewed for policy
          </p>
          <p className="text-sm whitespace-nowrap">compliance & integrity.</p>
        </div>
        <Icon
          className="h-16 w-16 rotate-90 md:rotate-0"
          name="right-arrow"
          color="rgb(216 193 172)"
        />
        <div className="flex flex-col items-center justify-center">
          <Icon
            className="h-24 md:h-32 p-2 mb-1"
            name="publish"
            color="rgb(216 193 172)"
          />
          <p className="lg:text-xl md:text-base text-sm font-medium -mt-1 whitespace-nowrap">
            All Published Here
          </p>
          <p className="text-sm whitespace-nowrap">
            Added to brand pages and the search
          </p>
          <p className="text-sm whitespace-nowrap">
            engine, with each citation mirrored.
          </p>
        </div>
      </div>
    </div>
  );
}
