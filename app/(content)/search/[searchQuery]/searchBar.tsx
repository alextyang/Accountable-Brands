"use client";

import Image from 'next/image'
import { Input } from 'postcss'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Icon } from '../../../lib/icons/ui-icons'
import Link from 'next/link'


export function SearchBar({searchQuery = "", prompt = "", icon = "search", styles = "", button = false, debug = true }: {searchQuery?: string, prompt?: string, icon?: string, styles?: string, button?:boolean, debug?: boolean }) {
    const router = useRouter();

    const [searchInput, setSearchInput] = useState(decodeURIComponent(searchQuery)); 
    const [suggestions, setSuggestions] = useState([]); // suggestions
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchInput(e.target.value);
        updateSuggestions(e.target.value);
    };

    const updateSuggestions = async (query: String) => {
        if (debug) { console.log("[Search] Current search query: " + query); }
        if (searchInput.length > 0) {
            // TODO: fetch suggestions
        }
    };

    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            if (debug) { console.log("[Search] Entered query: \n" + searchInput); }
            submitSearch();
        }
    };

    const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (debug) { console.log("[Search] Buttoned query: \n" + searchInput); }
        submitSearch();
    };

    const submitSearch = () => {
        if (searchInput && searchInput != '') {
            const params = encodeURI(searchInput);
            // if (!setSearchQuery) {
                if (debug) { console.log("[Search] Pushing URL: \n" + '/search/'+params); }
                router.push('/search/'+params);
            // } else {
            //     // if (debug) { console.log("[BrandSearch] Soft pushing URL: \n" + '/search?'+params); }
            //     // router.push('/search/?'+params, {  }); // TODO Shallow routing not available?
            //     setSearchQuery(searchInput);
            // }
        }
    }
    
    return (
      <div className={styles+" relative flex flex-row flex-nowrap text-xl font-medium"}>
        <input autoFocus type="search" placeholder={prompt} onChange={handleChange} onKeyDown={handleKeyPress} value={searchInput} className="w-100 h-full bg-transparent p-2 pl-2.5 pr-10 flex-1" />
        {icon != '' ? (<Icon name={icon} styles='absolute w-8 sm:w-9 top-1/2 -translate-y-1/2 right-1.5 sm:right-2.5'/>) : ''} 
        {button ? (<a onClick={handleSubmit} href='' className=' flex-initial w-1/5 max-w-44 flex justify-center items-center bg-black text-tan'>Search</a>) : ''}
        {/* TODO: render suggestions */} 
      </div>
    )
  }