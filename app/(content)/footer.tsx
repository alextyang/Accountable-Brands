"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ADD_BRAND_URL,
  ADD_REPORT_URL,
  THEME,
  FACEBOOK_LINK,
  INSTAGRAM_LINK,
  MW_URL,
  PATREON_LINK,
  TWITTER_LINK,
} from "../lib/definitions";
import { Icon } from "../lib/icons/interfaceIcons";
import { LetterMark } from "../lib/branding/branding";
import { CCIcons } from "../lib/branding/externalBranding";

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
    <div className="flex flex-col justify-self-end mt-auto w-full h-full px-5 py-5 text-base bg-black min-h-52 text-tan">
      <div className="flex flex-row flex-wrap justify-between w-full gap-y-2 whitespace-nowrap">
        <FooterLinksSection />
        <SocialLinksSection />
      </div>
      <div className="flex flex-row-reverse flex-wrap sm:flex-nowrap gap-y-6 justify-between items-end w-full px-2.5 mt-6 md:mt-12">
        <DisclaimerSection />
        <LetterMark className="h-12 mb-5 mr-auto" isLink={true} color={THEME.COLORS.TAN} />
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
    "This site is not affliated with any incorporated entities or organizations that appear on this page.";
  const viewsDisclaimer =
    "Even when citations are provided, site content comes with no guarantee of completeness, accuracy, or timeliness.";
  const fairUseDisclaimer =
    "Non-free materials are used as part of non-commercial critical commentary, believed to be in accordance with U.S. 'fair use'.";

  return (
    <div className="flex flex-col gap-2 text-xs italic font-normal text-right sm:ml-12">
      <p className="">
        {`${assocDisclaimer}`}
        <br className="hidden md:inline" />{" "}
        {`${viewsDisclaimer}`}
        <br className="hidden md:inline" />{" "}
        {`${fairUseDisclaimer}`}
      </p>
      <div className="flex flex-wrap items-center justify-end -mt-px gap-y-1 gap-x-4 md:flex-nowrap whitespace-nowrap">
        {legalLinks.map((link) => {
          return (
            <Link
              className="text-xs not-italic underline"
              key={link.link}
              href={link.href}
            >
              {link.link}
            </Link>
          );
        })}
        <div className="flex flex-row items-center justify-center flex-nowrap gap-0.5">
          <Link
            className="text-xs not-italic pr-0.5"
            href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1"
            target="_blank"
            rel="license noopener noreferrer"
          >
            Text is available under{" "}
            <span className="ml-px font-medium">CC BY 4.0</span>
          </Link>
          <CCIcons className="w-5 h-5 p-px " color={THEME.COLORS.TAN} />
        </div>
      </div>
    </div>
  );
}

function SocialLinksSection() {
  const iconStyle = "h-8 w-8";
  const socialIconParams = {
    className: "h-8 w-8",
    color: THEME.COLORS.TAN,
    viewBox: THEME.ICONS.VIEWBOX.SOCIAL
  };

  return (
    <div className=" flex flex-row justify-end ml-auto items-start gap-4 px-2.5 mt-4 lg:mt-1.5">
      <Link href={FACEBOOK_LINK}>
        <Icon name="facebook" {...socialIconParams} />
      </Link>
      <Link href={INSTAGRAM_LINK}>
        <Icon name="instagram" {...socialIconParams} />
      </Link>
      <Link href={TWITTER_LINK}>
        <Icon name="twitter" {...socialIconParams} />
      </Link>
      <Link href={PATREON_LINK}>
        <Icon name="patreon" {...socialIconParams} />
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
    <div className="flex flex-row sm:flex-nowrap flex-wrap gap-y-8 gap-x-16 justify-start items-start px-2.5">
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
    <div className="leading-relaxed text-left ">
      <h2 className="mb-1 font-semibold opacity-60">{links.header}</h2>
      {links.links.map((link, index) => {
        return (
          <Link
            key={link}
            href={links.hrefs[index]}
            className="block mb-1 font-medium"
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}
