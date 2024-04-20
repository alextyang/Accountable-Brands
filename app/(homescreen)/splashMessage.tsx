import React from "react";
import { BetaIndicator } from "@/app/lib/branding/branding";
import { randomInt } from "crypto";

const splashMessages = [
    "Crowd-sourced consumer empowerment.",
    "We don't cancel, we critique.",
    "Because actions speak louder than words.",
    "What marketing firms don't want you to know.",
    "Adding context to household names.",
];

export function SplashMessage({ }) {
    return (<div className="flex flex-col-reverse items-center justify-center w-full max-w-2xl gap-x-2 gap-y-1 mt-3 text-left sm:gap-x-3 sm:flex-row">
        <BetaIndicator className="opacity-90 sm:opacity-100" />
        <p className="h-full pt-0.5 mt-0.5 text-lg font-medium text-center leading-snug">
            {splashMessages[randomInt(splashMessages.length)]}
        </p>
    </div>);
}
