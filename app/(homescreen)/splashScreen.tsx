import { TitleSplash } from "@/app/media/branding/branding";
import React from "react";
import { HomeSearchBar } from "../(content)/search/[searchQuery]/searchBar";
import { Icon } from "@/app/media/icons/interfaceIcons";
import { SplashMessage } from "./splashMessage";

export function SplashScreen({ }) {
  return (
    <div
      className="relative flex flex-col items-center justify-start min-h-[450px] w-full h-screen align-middle"
    >
      <TitleSplash />
      <HomeSearchBar />
      <SplashMessage />

      <div className="absolute left-0 right-0 flex flex-row items-center justify-center w-full h-32 gap-1 bottom-[6vh]">
        <p className="text-xl font-medium">How it works</p>
        <Icon className="w-12 h-12 !block" name="down-arrow" />
      </div>

    </div>
  );
}
