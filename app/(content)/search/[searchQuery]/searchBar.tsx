"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Icon } from "../../../media/icons/interfaceIcons";
import Link from "next/link";

const DEBUG = true;

export function HomeSearchBar() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]); // suggestions

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    updateSuggestions(e.target.value);
  };

  const updateSuggestions = async (query: String) => {
    if (DEBUG) { console.log("[Search] Current search query: " + query); }
    if (searchInput.length > 0) {
      // TODO: fetch suggestions
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      if (DEBUG) { console.log("[Search] Entered query: \n" + searchInput); }
      submitSearch();
    }
  };

  const submitSearch = () => {
    if (searchInput && searchInput != "") {
      const params = encodeURIComponent(searchInput);
      if (DEBUG) { console.log("[Search] Pushing URL: \n" + "/search/" + params); }
      router.push("/search/" + params);
    }
  };

  return (
    <div className={"w-full h-12 max-w-2xl border-black border-6 relative flex flex-col sm:flex-row flex-nowrap text-xl font-medium"} >
      <input autoFocus type="search" placeholder={"Search for brands, products, industries..."} onChange={handleChange} onKeyDown={handleKeyPress} value={searchInput} className="w-100 h-full bg-transparent p-2 pl-2.5 pr-10 flex-1" />
      <Icon name="search-small" className="absolute w-8 sm:w-9 top-1/2 -translate-y-1/2 right-1.5 sm:right-2.5" />
      {/* TODO: render suggestions */}
    </div>
  );
}
