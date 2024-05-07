
export const MW_URL = "https://collab.accountablebrand.org"; // Location of MediaWiki Instance
export const ADD_BRAND_URL = MW_URL + "/wiki/"; // Prefix to brand pages
export const ADD_REPORT_URL = MW_URL + "/wiki/"; // Prefix to report pages
export const B_URL = process.env.NODE_ENV == "development" ? "http://localhost:3000" : "https://accountablebrand.org"; // Location of this instance

// Socials
export const FACEBOOK_LINK = '';
export const INSTAGRAM_LINK = 'https://www.instagram.com/accountablebrands/';
export const TWITTER_LINK = '';
export const MASTODON_LINK = 'https://mastodon.social/@accountability';
export const BLUESKY_LINK = 'https://bsky.app/profile/accountablebrands.bsky.social';
export const PATREON_LINK = '';
export const GIVEBUTTER_LINK = '';

export const DEBUG = false;

export const REVALIDATE_INTERVAL = 10 * 60 * 1000; // Cache revalidate
export const SIMULATE_LAG = 0; // Fetch delay for testing

export const THEME = {
    ICONS: {
        VIEWBOX: {
            MATERIAL: '0 -960 960 960',
            SOCIAL: '0 0 24 24'
        }
    },
    COLORS: {
        TAN: '#D8C1AC',
        BLACK: '#07090F',
        YELLOW: '#D29B31',
        GREEN: '#458A2D',
        RED: '#BF211E',
        BLUE: '#4E68C6'
    }
}


export type ParsedBrandPage = { // Structure of parsed Company/Organization page
    status: string, //TODO make enum
    id: number,
    wikipediaId?: number,
    name: string,
    wikipediaName?: string,
    url_name: string,
    logo?: {
        url: string,
    },
    coverImage?: {
        url: string,
        alt?: string
    },
    owner?: string,
    brands?: string,
    products?: string,
    industry?: string,
    description?: string,
    references?: string,
    importedReferences?: string[],
    reportNames: string[]
    reportPages?: ParsedReportPage[]
}

export type NewBrandPage = { // Structure of pending Company/Organization page
    status: string, //TODO make enum
    name: string,
    wikipediaName?: string,
    logo: {
        url?: string,
        previewUrl?: string,
    },
    coverImage: {
        url?: string,
        previewUrl?: string,
        alt?: string
    },
    owner?: string,
    brands?: string,
    products?: string,
    industry?: string,
    references?: string,
    description?: string,
}

export type ParsedReportPage = { // Structure of parsed report page
    status: string, //TODO make enum
    id: number,
    title: string,
    timeframe: string,
    type: string, //TODO make enum,
    preview: string,
    content: string | JSX.Element | JSX.Element[]
}

export type NewReportPage = { // Structure of pending report page
    status: string, //TODO make enum
    title: string,
    brandName: string,
    timeframe?: string,
    type: string, //TODO make enum,
    content?: string | JSX.Element | JSX.Element[]
}

// Report type classifications
export const REPORT_TYPES: {
    [key: string]: {
        name: string,
        longname: string,
        examples: string,
        color: string,
        text: string,
        icon: string,
        iconStyle: string,
        textLength: string
    }
} = {
    'Human Rights Abuse': {
        name: 'Human Rights',
        longname: 'Human Rights Abuse',
        examples: 'In responsibility or participation.',
        color: 'bg-red',
        text: 'text-red',
        icon: 'candle',
        iconStyle: 'pr-1 !block',
        textLength: '295px'
    },
    'Political Profits': {
        name: 'Political Profits',
        longname: 'Political Profits',
        examples: 'Lobbying, taxpayer burden, corruption.',
        color: 'bg-blue',
        text: 'text-blue',
        icon: 'eye',
        iconStyle: '',
        textLength: '310px'
    },
    'Anti-Consumer Tactics': {
        name: 'Anti-Consumer',
        longname: 'Anti-Consumer Tactics',
        examples: 'False claims, shrinkflation, market manipulation.',
        color: 'bg-green',
        text: 'text-green',
        icon: 'asterix',
        iconStyle: '',
        textLength: '340px'
    },
};