"use client";

import { useState } from "react";
import { WordMark } from "../media/branding/branding";
import { Icon, IconName } from "../media/icons/interfaceIcons";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { MW_URL } from "../data/definitions";
import { useParams, usePathname } from "next/navigation";
import { NavSearchBar } from "./search/[searchQuery]/navSearchBar";
import ClickOutside from "../media/utils/ClickOutside";

export default function NavBar() {
  const params = useParams<{ searchQuery: string }>();
  const path = usePathname();

  const menuButtonRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setIsSearchOpen(path.includes("/search"));
  }, [path, params]);

  const toggleSearch = () => {
    if (!isSearchOpen && isMenuOpen) {
      // Close menu if entering search
      setIsMenuOpen(false);
    }
    console.log("Setting Search " + !isSearchOpen);
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMenu = () => {
    console.log("[NavBar] Toggling menu");
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      console.log("[NavBar] Closing menu");
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="sticky w-100 h-min -mb-1.5 z-10">
      <div className="flex h-14 b border-b-black border-b-6 flex-nowrap">
        <WordMark className="h-full p-2.5 ml-2" />
        <div className="flex justify-end w-full justify-self-end flex-nowrap" ref={menuButtonRef} >
          {path.includes("/search") ? (
            ""
          ) : (
            <Icon name={isSearchOpen ? "search-open" : "search"} onClick={() => toggleSearch()} className={"cursor-pointer h-full aspect-square " + (isSearchOpen ? "p-1" : "p-1.5")} />
          )}
          <Icon name={isMenuOpen ? "menu-open" : "menu"} onClick={() => toggleMenu()} className="h-full p-1 cursor-pointer aspect-square" />
        </div>
      </div>
      {isMenuOpen ? (
        <ClickOutside onClick={closeMenu} exceptionRef={menuButtonRef}>
          <MenuDropdown className={isMenuOpen ? "hidden" : ""} />
        </ClickOutside>
      ) : (
        ""
      )}
      {isSearchOpen || path.includes("/search") ? (
        <NavSearchBar searchQuery={params.searchQuery} />
      ) : (
        ""
      )}
    </div>
  );
}

function MenuDropdown({ className = "" }) {
  const menuItems = [
    { title: "Home", icon: "home", href: "/", p: "0.25" },
    { title: 'Browse', icon: 'globe', href: '/browse', p: '0.5' },
    { title: "Contribute", icon: "write", href: MW_URL, p: "1" },
    { title: "Policies", icon: "policy", href: "/policy", p: "0.5" },
    { title: 'About', icon: 'info', href: '/about', p: '0.5' },
  ];

  return <Dropdown items={menuItems} className="absolute right-0" />;
}

function Dropdown({ items, className = "", }: { items: { title: string; icon: string; href: string; p: string }[]; className?: string; }) {
  return (
    <div className={className + " b border-x-black border-x-6 flex flex-nowrap flex-col z-50 text-xl font-medium -pt-1.5"} >
      {items.map((item) => {
        return (
          <div key={item.title} onClick={(e) => { e.preventDefault(); }}
            className="flex flex-row h-12 cursor-pointer relative bg-tan -pb-1.5 items-center justify-start pr-9 border-b-black border-b-6" >

            <Icon name={item.icon as IconName}
              className={" h-9 aspect-square ml-1 mr-1.5 p-" + item.p} />

            <p>{item.title}</p>

            <Link href={item.href}
              className="absolute top-0 bottom-0 left-0 right-0 ml-0.5" ></Link>

          </div>
        );
      })}
    </div>
  );
}
