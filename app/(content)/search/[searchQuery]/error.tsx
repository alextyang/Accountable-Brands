"use client";

import { Icon } from "@/app/lib/icons/ui-icons";
import { useEffect } from "react";

export default function SearchError({
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
    <div
      className="flex flex-col w-full justify-center items-center py-16 whitespace-nowrap"
      onClick={() => reset()}
    >
      <Icon className="h-24 w-24" name="error" />
      <p className="font-medium text-2xl">
        There was an issue with your search.
      </p>
      <p className="font-medium text-lg">Click on this message to try again.</p>
    </div>
  );
}
