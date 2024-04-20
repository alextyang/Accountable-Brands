import { promises as fs } from "fs";
import { Icon, IconEntry, IconSkip, IconTable } from "./iconDefinitions";
import { GOOD_SCORE_CUTOFF } from "./iconSearch";

const decoder = new TextDecoder("utf-8");



export class IconTableEditor {
    table: IconTable;
    currentKey: string;

    constructor() {
        this.table = {};
        this.currentKey = '';
    }

    async saveIconTable(tableName = "") {
        await fs.writeFile(
            tableName + "Icons.json",
            JSON.stringify(this.table),
            "utf-8"
        );
        console.log("[IconTable] Saved to " + tableName + "Icons.json");
    }

    async loadIconTable(tableName = "") {
        if (Object.keys(this.table).length > 0)
            return;
        console.log("[IconTable] Reading " + tableName + "Icons.json");
        this.table = JSON.parse(
            await fs.readFile(tableName + "Icons.json", { encoding: "utf8" })
        );
    }

    // Active query memory
    setKey(key: string) {
        return this.currentKey = key;
    }

    getKey() {
        return this.currentKey;
    }

    // Top level query-based entries
    hasEntry(key: string = this.currentKey): boolean {
        return this.table.hasOwnProperty(key);
    }

    getEntry(key: string = this.currentKey): IconEntry {
        if (!this.hasEntry(key))
            return { skips: [], uncertainty: 2 };
        return this.table[key];
    }

    createEntry(key: string = this.currentKey) {
        this.table[key] = { skips: [], uncertainty: 0 };
    }

    // Uncertainty score
    getUncertainty(key: string = this.currentKey): number {
        return this.getEntry(key).uncertainty;
    }

    setUncertainty(uncertainty: number, key: string = this.currentKey) {
        this.getEntry(key).uncertainty = uncertainty;
    }

    addUncertainty(increment: number, key: string = this.currentKey) {
        this.setUncertainty(this.getUncertainty(key) + increment, key);
    }

    // Get query list
    getQueries(): string[] {
        const table = this.table
        return Object.keys(this.table).sort((first: string, second: string) => {
            return (
                table[second].uncertainty -
                table[first].uncertainty);
        });
    }


    // Icon entries
    hasIcon(key: string = this.currentKey): boolean {
        return this.hasEntry(key) && this.table[key].hasOwnProperty('icon');
    }

    getIcon(key: string = this.currentKey): Icon | undefined {
        return this.getEntry(key).icon;
    }

    setIcon(icon: Icon, key: string = this.currentKey) {
        this.getEntry(key).icon = icon;
    }

    removeIcon(key: string = this.currentKey) {
        if (this.hasIcon(key))
            this.logSkips({ winningQuery: 'Rejected', icon: this.getEntry(key).icon, score: this.getEntry(key).score });
        this.getEntry(key).icon = undefined;
    }

    // Score entries
    hasScore(key: string = this.currentKey): boolean {
        return this.hasEntry(key) && this.table[key].hasOwnProperty('score');
    }

    getScore(key: string = this.currentKey): number | undefined {
        return this.hasScore(key) ? this.getEntry(key).score : 2;
    }

    setScore(score: number, key: string = this.currentKey) {
        this.getEntry(key).score = score;
    }


    // Skipped icons for a query
    getSkips(key: string = this.currentKey): IconSkip[] {
        return this.getEntry(key).skips
    }

    logSkips(...skips: IconSkip[]) {
        this.getEntry(this.currentKey).skips.push(...skips);
    }

    getEntryDetails(key: string = this.currentKey): { summary: string, confirm?: string, reject?: string } {
        const uncertainty = this.getUncertainty(key);
        const score = this.getScore(key);
        const numSkips = this.getSkips(key).length;

        if (this.hasIcon(key)) { // Icon found
            if (uncertainty <= -1) // Manual pick
                return { summary: 'Manually selected for ', reject: 'Mark as unsuitable' };

            if (score && score <= GOOD_SCORE_CUTOFF) { // Good score
                if (numSkips == 0) // No skips
                    return { summary: 'Used ideal icon for ', reject: 'Mark as unsuitable' };
                else // Skips made
                    return { summary: 'Found fallback for ', reject: 'Mark as unsuitable' };
            }
            else { // Poor score
                if (uncertainty <= -1) // Manually confirmed
                    return { summary: 'Approved fallback for ', reject: 'Mark as unsuitable' };

                if (numSkips == 0) // No skips
                    return { summary: 'No good-scoring icon for ', confirm: 'Mark as suitable', reject: 'Mark as unnecessary' };
                else // Skips made
                    return { summary: 'Poor-scoring fallback used for ', confirm: 'Mark as suitable', reject: 'Mark as redundant' };
            }
        }
        else { // No icon
            if (uncertainty <= 0) { // Manually ignored
                if (numSkips == 0) // No skips
                    return { summary: 'Skipped unnecessary ', reject: 'Mark as necessary' };
                else // Skips made
                    return { summary: 'Skipped redundant ', reject: 'Mark as necessary' };
            }
            else { // Not ignored
                if (numSkips == 0) // No skips
                    return { summary: 'Couldn\'t find icon for ', reject: 'Mark as unnecessary' };
                else // Skips made
                    return { summary: 'Couldn\'t find unique icon for ', reject: 'Mark as redundant' };
            }
        }

        return { summary: 'Error with ' };
    }



}



