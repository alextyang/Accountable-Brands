"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Icon } from "../../../lib/icons/ui-icons";

const DEBUG = false;

export function NavSearchBar({ searchQuery = "", }: { searchQuery?: string; }) {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(
    decodeURIComponent(searchQuery)
  );
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

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (DEBUG) { console.log("[Search] Buttoned query: \n" + searchInput); }
    submitSearch();
  };

  const submitSearch = () => {
    if (searchInput && searchInput != "") {
      const params = encodeURI(searchInput);
      if (DEBUG) { console.log("[Search] Pushing URL: \n" + "/search/" + params); }
      router.push("/search/" + params);
    }
  };

  return (
    <div className={"w-full -top-1.5 border-y-black border-y-6 h-24 sm:h-14 relative flex flex-col sm:flex-row flex-nowrap text-xl font-medium"} >
      <input
        autoFocus
        type="search"
        placeholder="Search for brands, products, industries..."
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        value={searchInput}
        className="w-full h-14 bg-transparent pb-3 pl-2.5 pr-10"
      />
      <Icon name="search" className="absolute sm:hidden h-8 w-8 sm:w-9 top-1/4 -translate-y-1/2 right-1.5 sm:right-2.5" />
      <a onClick={handleSubmit} href="" className="flex items-center justify-center flex-initial w-full pt-1 bg-black h-14 sm:pt-0 sm:h-full sm:w-1/5 sm:max-w-44 text-tan" > Search </a>
      {/* TODO: render suggestions */}
    </div>
  );
}
