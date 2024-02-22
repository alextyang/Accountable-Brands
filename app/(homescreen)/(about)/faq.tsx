import { Icon } from "@/app/lib/icons/ui-icons";
import React from "react";
export function Faq({}) {
  return (
    <div className="text-center max-w-xl flex flex-col justify-center items-center mt-20">
      <Icon className="h-24 w-24 mb-6 opacity-100" name="questions" />

      <h3 className="font-medium text-lg">
        What if I (or others) can&apos;t afford to choose better brands?
      </h3>
      <p className="mt-1 text-base">
        Corporate price-gouging has crippled affordable local business. This
        resource should not be used to judge those without a choice. Individual
        purchasing decisions, especially when coerced, should never take the
        blame.
        <br />
        <br />
        Supporting people-first regulations, reforms, and community solutions is
        much more important.
      </p>

      <h3 className="mt-14 font-medium text-lg">
        &apos; There&apos;s no ethical consumption under capitalism anyways.
        &apos;
      </h3>
      <p className="mt-1 text-base px-2">
        Our mission is to empower people to make informed decisions about who
        they support and how. Small choices are the first step towards broader
        awareness and activism.
        <br />
        <br />
        Underlying change may seem impossible — but corporate PR & the news
        cycle are designed to make it seem that way.
      </p>

      <h3 className="mt-14 font-medium text-lg">
        Think cancel culture is toxic & unproductive?
      </h3>
      <p className="mt-1 text-base px-3">
        We do too. That&apos;s why reports on individuals will never be allowed
        on this site. Further, our content policy prohibits reports on
        &apos;political posturing&apos; and &apos;crimes of aesthetic&apos; —
        where companies use hot-button issues to stir up buzz. These are
        marketing tactics.
        <br />
        <br />
        Reports focus on tangible political impact, like money spent on lobbying
        or received in subsidies, and never make prescriptive calls to action.
      </p>
    </div>
  );
}
