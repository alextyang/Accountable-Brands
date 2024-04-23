
import Fuse, { FuseResult } from "fuse.js"; // Search Lib
import { DEFAULT_INDUSTRY_ICON, Icon, IconSkip, IconTable } from "./iconDefinitions";
const DEBUG = true;

import icons from "@/icons.json"; // SVG Paths
const industryIcons = icons as Icon[];

import { IconTableEditor } from "./iconTable";


const fuseIndustryOptions = {
    shouldSort: true,
    includeScore: true,
    ignoreLocation: true,
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


export async function findIcon(name: string): Promise<Icon> {
    const result = await findIcons([name], [], '', 0, new IconTableEditor("solo"));
    return result[0] ? result[0] : DEFAULT_INDUSTRY_ICON;
}


// Recursively find new icons for each query 
export async function findIcons(queries: string[], excludeIcons: string[] = [], tag: string, startFrom = 0, table = new IconTableEditor("batch")): Promise<Icon[]> {
    if (!queries[startFrom])
        return [];
    let query = queries[startFrom];
    const key = query + ((tag.length > 0) ? ' (' + tag + ')' : '');

    await table.loadTable();
    table.setKey(key);

    if (table.shouldSearch()) { // New searches
        let searchResults = fuseProductsSearch.search(query);

        table.createEntry();

        // Iterate through search results while still picking
        while (searchResults[0] && !table.hasIcon()) {
            if (DEBUG) console.log("? " + query + " (" + startFrom + ") = " + searchResults[0].item.name + " - " + searchResults[0].score);

            // Icon is in exclusion list
            const existingIndex = excludeIcons.indexOf(searchResults[0].item.name);
            const existingSkipIndex = table.getBlacklist().indexOf(searchResults[0].item.name);
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
            else if (existingSkipIndex != -1 && !table.getSkips()[existingSkipIndex].winningQuery) { // Icon is blacklisted or duplicate
                if (DEBUG) console.log("B " + query + " (" + startFrom + ") = " + searchResults[0].item.name);

                // Move to next result
                searchResults.shift();
            }
            // Icon is too poor-scoring
            else if (searchResults[0].score && searchResults[0].score > BAD_SCORE_CUTOFF) {
                if (DEBUG) console.log("X " + query + " (" + startFrom + ") = " + searchResults[0].item.name + " > " + BAD_SCORE_CUTOFF);

                // Log remaining choices in table
                const remainingOptions = searchResults.map((searchResult): IconSkip => {
                    return {
                        winningQuery: 'Unused',
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
            else if (searchResults[0].score) { // Save good result
                if (DEBUG) console.log(query + " (" + startFrom + ") = " + searchResults[0].item.name + " + " + excludeIcons);

                table.setIcon(searchResults[0].item);
                table.setScore(searchResults[0].score);
                table.setFlag('none');

                // Score > 0 if skips were made, less than 0 if ideal was picked
                table.setUncertainty(searchResults[0].score - GOOD_SCORE_CUTOFF);

                // Log remaining choices in table
                searchResults.shift();
                const remainingOptions = searchResults.map((searchResult): IconSkip => {
                    return {
                        winningQuery: 'Unused',
                        score: searchResult.score,
                        icon: searchResult.item,
                    }
                });
                table.logSkips(...remainingOptions);

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
            table.saveTable();
            return [result];
        }
        return [result, ...(await findIcons(queries, [...excludeIcons, result.name], tag, startFrom, table))];
    }

    // If there weren't even options, flag log entry as most important
    if (table.getSkips().length == 0 && table.getUncertainty() > -1 && !table.hasFlag())
        table.setUncertainty(2);

    if (startFrom == queries.length) {
        table.saveTable();
        return [];
    }
    return [...(await findIcons(queries, [...excludeIcons], tag, startFrom, table))];
}

