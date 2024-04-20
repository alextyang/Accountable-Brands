
import Fuse, { FuseResult } from "fuse.js"; // Search Lib
import { DEBUG, DEFAULT_INDUSTRY_ICON, Icon, IconSkip, IconTable } from "./iconDefinitions";


import icons from "@/icons.json"; // SVG Paths
const industryIcons = icons as Icon[];

import { IconTableEditor } from "./iconTable";


const fuseIndustryOptions = {
    shouldSort: true,
    includeScore: true,
    ignoreLocation: false,
    ignoreFieldNorm: true,
    useExtendedSearch: true, // For finding an exact word match
    keys: ["name"],
};
const fuseIndustrySearch = new Fuse(industryIcons, fuseIndustryOptions);

const fuseProductOptions = {
    shouldSort: true,
    includeScore: true,
    ignoreLocation: true,
    ignoreFieldNorm: true,
    keys: ["name"],
};
const fuseProductsSearch = new Fuse(industryIcons, fuseProductOptions);


export const BAD_SCORE_CUTOFF = 0.5; // Ignore icons with poor matches
export const GOOD_SCORE_CUTOFF = 0.25; // Put good matches first


export function findIcon(name: string): Icon {
    // Isolate industry text from element, if needed
    var iconName = name.substring(name.indexOf(">") + 1, name.lastIndexOf("<"));

    const iconSearch = fuseIndustrySearch.search("\"" + iconName + "\"");

    if (DEBUG)
        console.log("[Icons] Industry icon found: " + iconName + " - " + iconSearch[0]?.item?.name + " (" + iconSearch[0]?.score + ")");

    return iconSearch[0] && iconSearch[0].score && iconSearch[0].score < BAD_SCORE_CUTOFF
        ? iconSearch[0].item
        : DEFAULT_INDUSTRY_ICON;
}


// Recursively find new icons for each query 
export async function findIcons(queries: string[], excludeIcons: string[] = [], tag: string, startFrom = 0, table = new IconTableEditor()): Promise<Icon[]> {
    if (!queries[startFrom])
        return [];
    let query = queries[startFrom];
    const key = query + ' (' + tag + ')';

    await table.loadIconTable("batch");
    table.setKey(key);

    if (!table.hasEntry() || (!table.hasIcon() && table.getEntry().uncertainty > 0) || (table.hasIcon() && table.getEntry().uncertainty > 1)) { // New searches
        let searchResults = fuseProductsSearch.search(query);

        table.createEntry();

        // Iterate through search results while still picking
        while (searchResults[0] && !table.hasIcon()) {
            if (DEBUG) console.log("? " + query + " (" + startFrom + ") = " + searchResults[0].item.name + " - " + searchResults[0].score);

            // Icon is in exclusion list
            const existingIndex = excludeIcons.indexOf(searchResults[0].item.name);
            if (existingIndex != -1) {
                if (DEBUG) console.log("X " + query + " (" + startFrom + ") = " + searchResults[0].item.name + " - " + excludeIcons);

                // Log in table
                table.logSkips({
                    score: searchResults[0].score,
                    icon: searchResults[0].item,
                    winningQuery: queries[existingIndex]
                });

                // Add to uncertainty
                if (searchResults[0].score && table.getUncertainty() < searchResults[0].score)
                    table.setUncertainty(searchResults[0].score);

                // Move to next result
                searchResults.shift();
            }
            // Icon is too poor-scoring
            else if (searchResults[0].score && searchResults[0].score > BAD_SCORE_CUTOFF) {
                if (DEBUG) console.log("X " + query + " (" + startFrom + ") = " + searchResults[0].item.name + " > " + BAD_SCORE_CUTOFF);

                // Log remaining choices in table
                const remainingOptions = searchResults.map((searchResult): IconSkip => {
                    return {
                        score: searchResult.score,
                        icon: searchResult.item,
                    }
                });
                table.logSkips(...remainingOptions);

                // Set uncertainty to the bad score
                table.setUncertainty(searchResults[0].score + 1);

                // Void results; nothing good scoring left
                searchResults = [];
            }
            else if (searchResults[0].score) { // Save result that isn't problematic
                if (DEBUG) console.log(query + " (" + startFrom + ") = " + searchResults[0].item.name + " + " + excludeIcons);

                table.setIcon(searchResults[0].item);
                table.setScore(searchResults[0].score);

                // Score > 0 if skips were made, less than 0 if ideal was picked
                table.setUncertainty(searchResults[0].score - GOOD_SCORE_CUTOFF);

                // Empty results
                searchResults = [];
            }
        }
    }

    const result = table.getIcon();

    // If result is found, call next round
    startFrom++;
    if (result) {
        if (startFrom == queries.length) {
            table.saveIconTable("batch");
            return [result];
        }
        return [result, ...(await findIcons(queries, [...excludeIcons, result.name], tag, startFrom, table))];
    }

    // If there weren't even options, flag log entry as important
    if (table.getSkips().length == 0 && table.getUncertainty() > -1)
        table.setUncertainty(2);

    if (startFrom == queries.length) {
        table.saveIconTable("batch");
        return [];
    }
    return [...(await findIcons(queries, [...excludeIcons], tag, startFrom, table))];
}

