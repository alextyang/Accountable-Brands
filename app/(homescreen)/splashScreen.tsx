import { TitleSplash } from "@/app/lib/assets/logos";
import React from "react";
import { SearchBar } from "../(content)/search/[searchQuery]/searchBar";
import BetaIndicator from "@/app/lib/assets/betaIndicator";
import { Icon } from "@/app/lib/icons/ui-icons";
import { SplashMessage } from "./splashMessage";

export function SplashScreen({ }) {
  return (
    <div
      style={{
        minHeight: "600px",
      }}
      className="relative flex flex-col items-center justify-start w-full h-screen align-middle"
    >
      <TitleSplash />
      <SearchBar
        prompt="Search for brands, products, industries..."
        className="w-full h-12 max-w-2xl border-black border-6"
        icon="search-small"
        debug />
      <SplashMessage />
      <div className="absolute left-0 right-0 flex flex-row items-center justify-center w-full h-32 gap-1 bottom-12">
        <p className="text-xl font-medium">How it works</p>
        <Icon className="w-12 h-12 !block" name="down-arrow" />
      </div>
    </div>
  );
}
