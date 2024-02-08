"use server";

import { LOW_SCORE_CUTOFF, loadMissingIconData, saveMissingIconData } from "@/app/lib/icons/dynamicIcons";


export async function ignoreMissingIconForQuery(key:string) {
    var missingIcons = await loadMissingIconData();
    console.log('Marking '+key+' to ignore.', missingIcons[key])
    if (!missingIcons[key]) return;
    missingIcons[key].ignoreScore = missingIcons[key].priority;
    console.log('Marking '+key+' to ignore.', missingIcons[key])
    saveMissingIconData(missingIcons);
}