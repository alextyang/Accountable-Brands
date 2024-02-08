
export const MW_URL = "https://collab.accountablebrand.org"; // Location of MediaWiki Instance
export const ADD_BRAND_URL = MW_URL+"/wiki/";
export const ADD_REPORT_URL = MW_URL+"/wiki/";
export const B_URL = "http://localhost:3000"; // Location of NextJs Instance

export const FACEBOOK_LINK = '';
export const INSTAGRAM_LINK = '';
export const TWITTER_LINK = '';
export const PATREON_LINK = '';

export const DEBUG = false;

export const REVALIDATE_INTERVAL = 0;
export const SIMULATE_LAG = 0;

export const COLORS = {
    TAN:'#D8C1AC',
    BLACK:'#07090F',
    YELLOW:'#D29B31',
    GREEN:'#458A2D',
    RED:'#BF211E',
    BLUE:'#4E68C6'
}


export type BrandPage = { // Structure of parsed Company/Organization page
    status: string, //TODO make enum
    id: number,
    name: string,
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
    reportNames: string[]
    reportPages?: ReportPage[]
}

export type ReportPage = { // Structure of parsed report page
    status: string, //TODO make enum
    id: number,
    title: string,
    timeframe: string,
    type: string, //TODO make enum,
    preview: string,
    content: string | JSX.Element | JSX.Element[]
}

export const REPORT_TYPES: {[key:string]:{name:string,longname:string,examples:string,color:string,text:string,icon:string,iconStyle:string,textLength:string,textPosition:{left:string,top:string}}} = {
    'Human Rights Abuse': {name:'Human Rights',longname:'Human Rights Abuse',examples:'In responsibility or participation.',color:'bg-red',text:'text-red',icon:'candle',iconStyle:'pr-1 !block',textLength:'295px',textPosition:{left:'-78.4px',top:'150px'}},
    'Political Profits': {name:'Political Profits',longname:'Political Profits',examples:'Lobbying, taxpayer burden, corruption.',color:'bg-blue',text:'text-blue',icon:'eye',iconStyle:'',textLength:'310px',textPosition:{left:'-92.4px',top:'155.5px'}},
    'Anti-Consumer Tactics': {name:'Anti-Consumer',longname:'Anti-Consumer Tactics',examples:'False claims, shrinkflation, market manipulation.',color:'bg-green',text:'text-green',icon:'asterix',iconStyle:'',textLength:'310px',textPosition:{left:'-78.4px',top:'150px'}},
};