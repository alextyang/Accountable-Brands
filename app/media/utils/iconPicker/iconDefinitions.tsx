export const DEBUG = false;

export type Icon = { name: string; path: string; viewbox?: string };
export const DEFAULT_INDUSTRY_ICON: Icon = { name: "", path: "" }; // TODO: Placeholder icon

export type IconSkip = { // TYPE: Log for an failed icon pick
    winningQuery?: string;
    score?: number;
    icon?: Icon;
};

export type IconFlag = 'approved' | 'removed' | 'skipped' | 'replaced' | 'none';

export type IconEntry = {
    skips: IconSkip[];
    icon?: Icon;
    score?: number;
    uncertainty: number;
    flag: IconFlag;
}

export type IconEntryDescription = { summary: string, flagApprove?: string, flagSkip?: string, flagReplaced?: string, flagRemove?: string };

export type IconTable = { // TYPE: Logs for picked icons
    [query: string]: IconEntry;
};

