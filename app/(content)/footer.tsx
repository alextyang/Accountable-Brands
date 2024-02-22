"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ADD_BRAND_URL,
  ADD_REPORT_URL,
  COLORS,
  FACEBOOK_LINK,
  INSTAGRAM_LINK,
  MW_URL,
  PATREON_LINK,
  TWITTER_LINK,
} from "../lib/definitions";
import { CCIcons, ServiceIcon } from "../lib/icons/ui-icons";
import { TanIconMark } from "../lib/assets/logos";

type FooterLinkList = { header: string; links: string[]; hrefs: string[] }[];
const baseFooterLinks: FooterLinkList = [
  {
    header: "Find Brands",
    links: ["Search", "Browse"],
    hrefs: ["/search", "/browse"],
  },
  {
    header: "Submit Content",
    links: ["Add Brand Page", "Add Report"],
    hrefs: [ADD_BRAND_URL, ADD_REPORT_URL],
  },
  {
    header: "About",
    links: [
      "Accountable Brands",
      "Our Sources",
      "Report Policy",
      "How to Contribute",
    ],
    hrefs: ["/about", "/about/sources", "/about/policy", MW_URL],
  },
];

export default function Footer() {
  const [pageDisclaimer, setPageDisclaimer] = useState(baseFooterLinks);

  return (
    <div className="mt-auto w-full h-full px-5 py-5 min-h-52 bg-black text-tan flex flex-col text-base">
      <div className="flex flex-col lg:flex-row justify-between w-full whitespace-nowrap">
        <FooterLinksSection />
        <SocialLinksSection />
      </div>
      <div className="flex flex-row justify-between items-end w-full px-2.5 mt-5">
        <TanIconMark className="h-12 mb-5" isLink={true} />
        <DisclaimerSection />
      </div>
    </div>
  );
}

const legalLinks: { link: string; href: string }[] = [
  {
    link: "Disclaimers",
    href: "/disclaimers",
  },
  {
    link: "Terms of Service",
    href: "/terms",
  },
  {
    link: "Privacy Policy",
    href: "/privacy",
  },
];

function DisclaimerSection() {
  const assocDisclaimer =
    "This site is not affliated with any corporate entities/organizations that appear on this page.";
  const viewsDisclaimer =
    "Even when cited, site content comes with no guarantee of completeness, accuracy, or timeliness.";
  const fairUseDisclaimer =
    "Non-free materials are used as part of non-commercial critical commentary, believed to be in accordance with U.S. 'fair use'.";

  return (
    <div className="flex flex-col gap-2 text-right text-xs font-normal italic ml-12">
      <p className="">
        {`${assocDisclaimer}`}
        <br />
        {`${viewsDisclaimer}`}
        <br />
        {`${fairUseDisclaimer}`}
      </p>
      <div className="flex justify-end items-center -mt-px">
        {legalLinks.map((link) => {
          return (
            <Link
              className="text-xs underline not-italic mr-4"
              key={link.link}
              href={link.href}
            >
              {link.link}
            </Link>
          );
        })}
        <Link
          className="text-xs not-italic pr-0.5"
          href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1"
          target="_blank"
          rel="license noopener noreferrer"
        >
          Text is available under{" "}
          <span className="ml-px font-medium">CC BY 4.0</span>
        </Link>
        <CCIcons className="h-5 w-5 p-px " color={COLORS.TAN} />
      </div>
    </div>
  );
}

function SocialLinksSection() {
  const iconStyle = "h-8 w-8";

  return (
    <div className=" flex flex-row justify-end items-start gap-4 px-2.5 mt-4 lg:mt-1.5">
      <Link href={FACEBOOK_LINK}>
        <ServiceIcon className={iconStyle} name="facebook" color="#D8C1AC" />
      </Link>
      <Link href={INSTAGRAM_LINK}>
        <ServiceIcon className={iconStyle} name="instagram" color="#D8C1AC" />
      </Link>
      <Link href={TWITTER_LINK}>
        <ServiceIcon className={iconStyle} name="twitter" color="#D8C1AC" />
      </Link>
      <Link href={PATREON_LINK}>
        <ServiceIcon className={iconStyle} name="patreon" color="#D8C1AC" />
      </Link>
    </div>
  );
}

function FooterLinksSection() {
  const [footerLinks, setFooterLinks] = useState(baseFooterLinks);

  useEffect(() => {
    const checkURLQuery = () => {
      const pageSlug = decodeURI(window ? window.location.pathname : "");
      const pageName = pageSlug.includes("b/")
        ? pageSlug.substring(2, pageSlug.indexOf("/"))
        : "";
      const newFooterLinks = baseFooterLinks;

      if (pageName.length > 0) {
        // Adjust collaboration links if on a collaborative page.
        console.log("[Footer] Page Name found: ", pageName);

        newFooterLinks[1].links.push("↳     To " + pageName);
        newFooterLinks[1].hrefs.push(MW_URL + "/wiki/" + pageName);
        newFooterLinks[1].links.push("↳     To Another Brand");
        newFooterLinks[1].hrefs.push(ADD_REPORT_URL);
      }

      setFooterLinks(newFooterLinks);
    };

    window.addEventListener("onload", checkURLQuery);
  });

  return (
    <div className="flex flex-row justify-start items-start px-2.5">
      {footerLinks.map((footerLink) => {
        return <FooterLinksList key={footerLink.header} links={footerLink} />;
      })}
    </div>
  );
}

function FooterLinksList({
  links,
}: {
  links: { header: string; links: string[]; hrefs: string[] };
}) {
  return (
    <div className="text-left leading-relaxed pr-16">
      <h2 className="font-semibold opacity-60 mb-1">{links.header}</h2>
      {links.links.map((link, index) => {
        return (
          <Link
            key={link}
            href={links.hrefs[index]}
            className="font-medium mb-1 block"
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}
