"use client";

import { MW_URL } from "@/app/data/definitions";
import { Icon } from "@/app/media/icons/interfaceIcons";
import { useEffect } from "react";

export default function BrandPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col w-full justify-center items-center py-16 cursor-pointer">
      <Icon className="h-24 w-24" name="error" />
      <p className="font-medium text-2xl">
        There was an issue loading this brand page.
      </p>
      <p onClick={() => reset()} className="font-medium text-lg ">
        Click on this message to try again.
      </p>
      <a
        href={MW_URL + "/wiki/" + window.location.pathname.split("/")[2]}
        className="font-medium leading-loose text-lg underline"
      >
        Or check the collaborative version.
      </a>
    </div>
  );
}

export function ReportPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col w-full justify-center items-center py-16">
      <Icon className="h-24 w-24" name="error" />
      <p className="font-medium text-2xl">
        There was an issue loading the reports.
      </p>
      <p onClick={() => reset()} className="font-medium text-lg ">
        Click on this message to try again.
      </p>
      <a
        href={MW_URL + "/wiki/" + window.location.pathname.split("/")[0]}
        className="font-medium leading-loose text-lg underline"
      >
        Or check the collaborative version.
      </a>
    </div>
  );
}
