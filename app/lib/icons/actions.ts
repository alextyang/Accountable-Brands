"use server";

import { loadMissingIconData, saveMissingIconData } from "@/app/lib/icons/dynamicIcons";

// SERVER ACTION: Ignore a given icon error/conflict
export async function ignoreMissingIconForQuery(key: string) {
    var missingIcons = await loadMissingIconData();
    console.log('Marking ' + key + ' to ignore.', missingIcons[key])
    if (!missingIcons[key])
        return;

    missingIcons[key].ignoreScore = missingIcons[key].priority;
    saveMissingIconData(missingIcons);
}