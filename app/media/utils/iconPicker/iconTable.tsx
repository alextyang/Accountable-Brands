import { promises as fs } from "fs";
import { DEBUG, Icon, IconEntry, IconEntryDescription, IconFlag, IconSkip, IconTable } from "./iconDefinitions";
import { GOOD_SCORE_CUTOFF } from "./iconSearch";

const decoder = new TextDecoder("utf-8");

const tableChanges: {
    [tableName: string]: IconTable[];
} = {
    "solo": [],
    "batch": []
};
let isWriting = false;
let timeoutID: string | number | NodeJS.Timeout | undefined;

if (timeoutID == undefined)
    timeoutID = setTimeout(saveTablesToFile, 5 * 1000);

export async function requestTableSave(tableName: string) {
    await saveTableToFile(tableName);
}

async function saveTablesToFile() {
    if (tableChanges['solo'].length > 0 || tableChanges['batch'].length > 0)
        if (DEBUG) console.log("[Queue] Trying periodic save of " + tableChanges['solo'].length + ", " + tableChanges['batch'].length + " (ID " + timeoutID + ")");

    await saveTableToFile("solo");
    await saveTableToFile("batch");

    clearTimeout(timeoutID);
    timeoutID = setTimeout(saveTablesToFile, 5 * 1000);
}

async function saveTableToFile(tableName: string) {
    if (isWriting || tableChanges[tableName].length == 0) {
        if (tableChanges[tableName].length != 0)
            console.log("[Queue] Skipping save request of " + tableChanges[tableName].length + " to " + tableName);
        return undefined;
    }
    isWriting = true;


    if (DEBUG) console.log("[File] Saving " + tableName + " table queue (" + tableChanges[tableName].length + ")");

    const tableQueue = JSON.parse(JSON.stringify(tableChanges[tableName])) as IconTable[];
    tableChanges[tableName].length = 0;

    if (DEBUG) console.log("[File] Formatted " + tableName + " table queue (" + tableQueue.length + ")");


    const fileTable = await JSON.parse(
        await fs.readFile(tableName + "Icons.json", { encoding: "utf8" })
    ) as IconTable;

    tableQueue.unshift(fileTable);

    while (tableQueue.length > 1) {
        tableQueue[tableQueue.length - 2] = Object.assign(tableQueue[tableQueue.length - 2], tableQueue[tableQueue.length - 1]);
        tableQueue.pop();
    }


    await fs.writeFile(
        tableName + "Icons.json",
        JSON.stringify(tableQueue[0]),
        "utf-8"
    );

    if (DEBUG) console.log("[File] Saved " + tableName + " table queue (" + (tableQueue.length - 1) + ")");
    isWriting = false;
}

export class IconTableEditor {
    currentKey: string;
    tableName: string;
    workingTable: IconTable;
    madeEdits: boolean;

    constructor(tableName: string) {
        this.workingTable = {};
        this.tableName = tableName;
        this.currentKey = '';
        this.madeEdits = false;
    }

    async loadTable() {
        const loadedTable = await JSON.parse(
            await fs.readFile(this.tableName + "Icons.json", { encoding: "utf8" })
        );
        this.workingTable = Object.assign(loadedTable, this.workingTable);

        if (DEBUG) console.log("[IconTable] Loaded working table (" + Object.keys(this.workingTable).length + " entries) for " + this.tableName);
    }

    async updateTable() {
        while (isWriting) {
            if (DEBUG) console.log("[IconTable] Waiting to sync working table " + this.tableName);
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        this.loadTable();
    }

    async saveTable(tableName: string = this.tableName) {
        while (isWriting) {
            if (DEBUG) console.log("[IconTable] Waiting to save to " + this.tableName);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (DEBUG) console.log("[IconTable] Saving working table (" + Object.keys(this.workingTable).length + " entries) to " + this.tableName + " table queue (" + tableChanges[this.tableName].length + " objects)");

        if (this.madeEdits)
            tableChanges[this.tableName].push(this.workingTable);
        // await tryTableSave(this.tableName);
        this.madeEdits = false;

        this.updateTable();
    }

    // Active query memory 
    setKey(key: string) {
        return this.currentKey = key;
    }

    getKey() {
        return this.currentKey;
    }

    // If a new icon should be attempted for this entry
    shouldSearch(key: string = this.currentKey): boolean {
        return !this.hasEntry() || (!this.hasIcon() && (this.getFlag() == 'removed' || this.getFlag() == 'none'));
    }

    // Top level query-based entries
    hasEntry(key: string = this.currentKey): boolean {
        return key in this.workingTable;
    }

    getEntry(key: string = this.currentKey): IconEntry {
        if (!this.hasEntry(key))
            this.createEntry(key);
        return this.workingTable[key];
    }

    createEntry(key: string = this.currentKey) {
        let skips = [], flag: IconFlag = 'none';
        this.madeEdits = true;

        if (this.workingTable[key]) {
            while (this.workingTable[key].skips.length > 0) {
                if (!this.workingTable[key].skips[0].winningQuery)
                    skips.push(this.workingTable[key].skips[0]);
                this.workingTable[key].skips.shift();
            }
            flag = this.workingTable[key].flag;
        }

        this.workingTable[key] = { skips: skips, uncertainty: 0, flag: flag };
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
        const table = this.workingTable
        return Object.keys(this.workingTable).sort((first: string, second: string) => {
            return (
                table[second].uncertainty -
                table[first].uncertainty);
        });
    }

    // Get query list
    getFlaggedQueries(): string[] {
        const table = this.workingTable
        return Object.keys(this.workingTable).sort((first: string, second: string) => {
            return (
                table[second].uncertainty -
                table[first].uncertainty);
        }).filter((entry) => {
            return table[entry].flag != 'none';
        });
    }

    // Get query list
    getUnflaggedQueries(): string[] {
        const table = this.workingTable
        return Object.keys(this.workingTable).sort((first: string, second: string) => {
            const strCompare = second.substring(second.indexOf('(') + 1, second.indexOf(')')).localeCompare(first.substring(first.indexOf('(') + 1, first.indexOf(')')));
            if (strCompare == 0)
                return table[second].uncertainty - table[first].uncertainty;
            return strCompare;
        }).filter((entry) => {
            return table[entry].flag == 'none';
        });
    }


    // Icon entries
    hasIcon(key: string = this.currentKey): boolean {
        return this.hasEntry(key) && this.workingTable[key].hasOwnProperty('icon');
    }

    getIcon(key: string = this.currentKey): Icon | undefined {
        return this.getEntry(key).icon;
    }

    setIcon(icon: Icon | undefined, key: string = this.currentKey) {
        if (!icon)
            this.removeIcon(key);
        this.getEntry(key).icon = icon;
    }

    removeIcon(key: string = this.currentKey) {
        if (this.hasIcon(key))
            this.getEntry(this.currentKey).skips.unshift({ icon: this.getEntry(key).icon, score: this.getEntry(key).score });
        this.getEntry(key).icon = undefined;
    }

    // Score entries
    hasScore(key: string = this.currentKey): boolean {
        return this.hasEntry(key) && this.workingTable[key].hasOwnProperty('score');
    }

    getScore(key: string = this.currentKey): number | undefined {
        return this.hasScore(key) ? this.getEntry(key).score : 2;
    }

    setScore(score: number, key: string = this.currentKey) {
        this.getEntry(key).score = score;
    }

    // Manual flagging
    getFlag(key: string = this.currentKey): IconFlag {
        return this.getEntry(key).flag;
    }

    hasFlag(key: string = this.currentKey): boolean {
        return this.getEntry(key).flag != 'none';
    }

    setFlag(flag: IconFlag, key: string = this.currentKey) {
        this.madeEdits = true;
        this.getEntry(key).flag = flag;
    }


    // Skipped icons for a query
    getSkips(key: string = this.currentKey): IconSkip[] {
        return this.getEntry(key).skips
    }

    getBlacklist(key: string = this.currentKey): (string | undefined)[] {
        return this.getEntry(key).skips.map((skip) => {
            return !skip.winningQuery ? skip.icon?.name : undefined;
        })
    }

    clearBlacklist(key: string = this.currentKey) {
        let skips = [];
        while (this.workingTable[key].skips.length > 0) {
            if (this.workingTable[key].skips[0].winningQuery)
                skips.push(this.workingTable[key].skips[0]);
            this.workingTable[key].skips.shift();
        }
        this.workingTable[key].skips = skips;
    }

    logSkips(...skips: IconSkip[]) {
        this.getEntry(this.currentKey).skips.push(...skips);
    }


    getEntryDetails(key: string = this.currentKey): IconEntryDescription {
        const uncertainty = this.getUncertainty(key);
        const score = this.getScore(key);
        const flag = this.getFlag(key);
        const skips = this.getSkips(key);
        const hasSkip = score && skips && skips.length > 0 && skips[0].score && skips[0].score < score;

        const entryDetails: IconEntryDescription = { summary: 'Error with entry ' };

        if (this.hasIcon(key)) { // Icon found
            entryDetails.flagApprove = 'Flag as suitable';
            entryDetails.flagReplaced = 'Find replacement';
            entryDetails.flagRemove = 'Flag as unsuitable';
            entryDetails.flagSkip = 'Flag redundant/unnecessary';

            if (flag == 'approved') // Manual pick
                return { ...entryDetails, summary: 'Approved for ', flagReplaced: 'Edit icon', flagApprove: 'Remove approval' };

            if (flag == 'replaced') // Manual pick
                return { ...entryDetails, summary: 'Manually selected for ', flagReplaced: 'Edit replacement', flagApprove: undefined };

            if (score && score <= GOOD_SCORE_CUTOFF) { // Good score
                if (hasSkip) // Skip made
                    return { ...entryDetails, summary: 'Found fallback for ' };
                else // No skips
                    return { ...entryDetails, summary: 'Used ideal icon for ' };

            }
            else { // Poor score
                if (uncertainty <= -1) // Manually confirmed
                    return { ...entryDetails, summary: 'Approved fallback for ' };

                if (!hasSkip) // No skips
                    return { ...entryDetails, summary: 'No good-scoring icon for ' };
                else // Skips made
                    return { ...entryDetails, summary: 'Poor-scoring fallback used for ' };
            }
        }
        else { // No icon
            entryDetails.flagReplaced = 'Find icon';

            if (flag == 'removed')
                entryDetails.flagRemove = 'Undo removal';

            if (flag == 'skipped') { // Manually ignored
                if (!hasSkip) // No skips
                    return { ...entryDetails, summary: 'Skipped unnecessary ', flagSkip: 'Mark as necessary' };
                else // Skips made
                    return { ...entryDetails, summary: 'Skipped redundant ', flagSkip: 'Mark as necessary' };
            }
            else { // Not ignored
                entryDetails.flagRemove = 'Flag for replacement';

                if (!hasSkip) // No skips
                    return { ...entryDetails, summary: 'Couldn\'t find icon for ', flagSkip: 'Mark as unnecessary' };
                else // Skips made
                    return { ...entryDetails, summary: 'Couldn\'t find unique icon for ', flagSkip: 'Mark as redundant' };
            }
        }

        return { ...entryDetails };
    }



}



