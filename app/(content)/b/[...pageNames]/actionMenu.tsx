"use client";

import { MW_URL } from "@/app/lib/definitions";
import { Icon, InteractiveIcon } from "@/app/lib/icons/ui-icons";
import ClickOutside from "@/app/lib/utils/clickOutside";
import Link from "next/link";
import { useState } from "react";

const MW_DIRECT_URL = MW_URL + "/w/index.php";

export default function ActionMenu({
  pageName,
  pageUrlName,
}: {
  pageName: string;
  pageUrlName: string;
}) {
  const url = MW_DIRECT_URL + new URLSearchParams({ title: pageName });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => {
    console.log("[Page] Toggling menu");
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    console.log("[Page] Toggling menu");
    setIsMenuOpen(false);
  };

  return (
    <div className="relative h-14 aspect-square mt-0.5 -mb-1 p-1">
      <InteractiveIcon
        className=" cursor-pointer"
        onClick={openMenu}
        name={pageName.includes("/") ? "vertical-dots" : "horizontal-dots"}
      />
      <ClickOutside onClick={closeMenu}>
        {isMenuOpen ? (
          <ActionDropdown className="absolute right-4" pageName={pageName} pageUrlName={pageUrlName} />
        ) : (
          ""
        )}
      </ClickOutside>
    </div>
  );
}

function ActionDropdown({
  pageName,
  pageUrlName,
  className = "",
}: {
  pageName: string;
  pageUrlName: string;
  className?: string;
}) {
  const items = [
    {
      title: pageName.includes("/") ? "Edit Report" : "Edit Brand Page",
      icon: "edit-page",
      href: MW_DIRECT_URL + "?title=" + encodeURIComponent(pageName) + "&veaction=edit",
      p: "0.5",
    },
    {
      title: "Open Discussion",
      icon: "discussion",
      href: MW_DIRECT_URL + "?title=Talk:" + encodeURIComponent(pageName) + "",
      p: "0.5",
    },
    // {title: 'Report Content', icon: 'report', href: MW_DIRECT_URL+'?title=Talk:'+pageName+'', p: '0.25'},
  ];

  return (
    <div
      className={
        className +
        " b border-x-black border-x-6  flex flex-nowrap flex-col z-50 font-medium -pt-1.5 whitespace-nowrap text-base"
      }
    >
      <div className=" text-tan bg-black px-1 pt-1 pb-0.5">
        <p>Content is user-submitted.</p>
      </div>
      {items.map((item) => {
        return (
          <div
            key={item.title}
            className="flex flex-row h-12 cursor-pointer relative bg-tan -pb-1.5 items-center justify-start pr-4  border-b-black border-b-6"
          >
            <Icon
              name={item.icon}
              className={"aspect-square h-9 aspect-square m-1 mr-1 p-" + item.p}
            />
            <p>{item.title}</p>
            <Link
              href={item.href}
              className="absolute top-0 bottom-0 left-0 right-0 ml-0.5"
            ></Link>
          </div>
        );
      })}
    </div>
  );
}
