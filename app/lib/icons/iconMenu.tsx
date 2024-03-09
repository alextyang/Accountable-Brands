"use client";

import { ignoreMissingIconForQuery } from './actions';

// COMPONENT: Option to ignore an icon error/conflict
export function IgnoreButton({ iconKey, message }: { iconKey: string, message: string }) {
    if (message.length < 2) return '';
    const ignoreMissingIconAction = ignoreMissingIconForQuery.bind(null, iconKey);
    console.log(iconKey);

    return (
        <p className="text-sm opacity-75 hover:opacity-100 hover:underline cursor-pointer" onClick={async () => {
            ignoreMissingIconAction();
        }}>{message}</p>
    );

}