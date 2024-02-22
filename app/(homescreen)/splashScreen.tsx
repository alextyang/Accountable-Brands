import { TitleSplash } from "@/app/lib/assets/logos";
import React from "react";
import { SearchBar } from "../(content)/search/[searchQuery]/searchBar";
import BetaIndicator from "@/app/lib/assets/betaIndicator";
import { Icon } from "@/app/lib/icons/ui-icons";

export function SplashScreen({}) {
  return (
    <div
      style={{
        minHeight: "600px",
      }}
      className="h-screen w-full relative flex flex-col items-center justify-start align-middle"
    >
      <TitleSplash />
      <SearchBar
        prompt=""
        className="w-full max-w-2xl h-12 border-black border-6"
        icon="search-small"
        debug
      />
      <div className="w-full max-w-2xl flex flex-row justify-center mt-3 gap-3">
        <BetaIndicator />
        <p className="font-medium text-lg">
          Crowd-sourced consumer empowerment.
        </p>
      </div>
      <div className="absolute flex flex-row items-center justify-center h-32 bottom-12 w-full left-0 right-0 gap-1">
        <p className="text-xl font-medium">How it works</p>
        <Icon className="w-12 h-12 !block" name="down-arrow" />
      </div>
    </div>
  );
}
