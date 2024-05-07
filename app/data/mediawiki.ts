// MediaWiki API Interface
"use server";

import { B_URL, ParsedBrandPage, DEBUG, MW_URL, ParsedReportPage, SIMULATE_LAG, REVALIDATE_INTERVAL, REPORT_TYPES, NewBrandPage, NewReportPage } from './definitions'



// 
// Parse Pages
// 


// HTML Rendering
import parseHTML from 'html-react-parser';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purifyHTML = DOMPurify(window);

function renderHTMLString(str?: string): string | JSX.Element | JSX.Element[] {
    return parseHTML(purifyHTML.sanitize(str ? str : ''));
}



// Utility type for parsing MediaWiki pages
type HTMLStringLocation = {
    startToken: string,
    endToken: string,
    lastOccurance?: boolean
}

// HTML Scraper: Embedded API Info
const WIKI_HTML_MAP = {
    ID: { startToken: "<!-- dbpageid: ", endToken: "bpid--> " },
    TITLE: { startToken: "<!-- dbpagetitle: ", endToken: "bpt--> " },
};

// HTML Scraper: Brand page
const BRAND_HTML_MAP = {
    DATATABLE: {
        startToken: "<table class=\"mw-capiunto-infobox brand-page-infobox\"",
        endToken: "</table>"
    },

    LOGO_URL: {
        startToken: "class=\"mw-file-description\"><img src=\"",
        endToken: "\" decoding=\"async\""
    },

    COVER_URL: {
        startToken: "class=\"mw-file-description\"><img src=\"",
        endToken: "\" decoding=\"async\"", lastOccurance: true
    },

    INDUSTRY: {
        startToken: "class=\"brand-md-industry-div\">",
        endToken: "</td></tr>"
    },

    OWNER: {
        startToken: "class=\"brand-md-parent-div\">",
        endToken: "</td></tr>"
    },

    BRANDS: {
        startToken: "class=\"brand-md-brands-div\">",
        endToken: "</td></tr>"
    },

    PRODUCTS: {
        startToken: "class=\"brand-md-products-div\">",
        endToken: "</td></tr>"
    },

    SUMMARY: {
        startToken: "</table>",
        endToken: "<span class=\"mw-headline\" id=\"Reports\">"
    },

    REPORTS: {
        startToken: "<span class=\"mw-headline\" id=\"Reports\">",
        endToken: "</ul>",
    },

    // REFERENCES: {
    //     startToken: "<div class=\"mw-references-wrap\">",
    //     endToken: "</div>",
    // },

    IMPORTED_REFERENCES: {
        startToken: "<div class=\"mw-references-wrap",
        endToken: "</div>",
    },
}

// HTML Scraper: Report page
const REPORT_HTML_MAP = {
    DATATABLE: {
        startToken: "<table class=\"mw-capiunto-infobox report-page-infobox\"",
        endToken: "</table>"
    },
    TYPE: {
        startToken: "class=\"report-md-type-div\">",
        endToken: "</td></tr><tr><th scope=\"row\" class=\"mw-capiunto-infobox-label\">Date(s)"
    },
    TIMEFRAME: {
        startToken: "class=\"brand-md-timeframe-div\">\n",
        endToken: "</td></tr></tbody>"
    },
    CONTENT: {
        startToken: "</table>\n",
        endToken: "</div>", lastOccurance: true
    },
}

// HTML Scraper: Wikipedia excerpt
const WE_HEADER = 'class=\"card wikipedia-excerpt';
const WE_END = 'class=\"card-border';

// HTML Scraper function (single result)
function locateParam(htmlString: string, paramLoc: HTMLStringLocation): string { //TODO: Report errors
    const afterStr = htmlString.substring(
        (paramLoc.lastOccurance ? htmlString.lastIndexOf(paramLoc.startToken) : htmlString.indexOf(paramLoc.startToken))
        + paramLoc.startToken.length);

    if (htmlString.indexOf(paramLoc.startToken) == -1 || afterStr.indexOf(paramLoc.endToken) == -1)
        return '';

    return afterStr.substring(0,
        afterStr.indexOf(paramLoc.endToken)
    ).trim();
}

// HTML Scraper function (multiple results)
function locateParams(htmlString: string, paramLoc: HTMLStringLocation): string[] {
    const [first, ...splitStr] = htmlString.split(paramLoc.startToken);
    if (splitStr && splitStr.length > 0) {
        return splitStr.map(str => {
            return locateParam(paramLoc.startToken + str, paramLoc);
        });
    }
    return [];
}


// Parse functions

// Point imported links to MediaWiki (original) domain
function recontextualizeLinks(htmlString: string): string { // fixes mediawiki-specific links
    return htmlString.replaceAll('\'/wiki/', '\'' + MW_URL + '/wiki/').replaceAll('\"/wiki/', '\"' + MW_URL + '/wiki/').replaceAll(' /wiki/', ' ' + MW_URL + '/wiki/').replaceAll('\'/w/', '\'' + MW_URL + '/w/').replaceAll('\"/w/', '\"' + MW_URL + '/w/').replaceAll(' /w/', ' ' + MW_URL + '/w/'); //TODO Regex
}

// Point imported links to local domain
function adoptLinks(htmlString: string): string {
    return htmlString.replaceAll('/w/', B_URL + '/b/');
}

// Improve reference format for imported MW HTML
function fixReferenceIds(htmlString: string, tag: string): string {
    const [start, ...splitStr] = htmlString.split('id=\"cite_');

    if (!splitStr || splitStr.length == 0)
        return htmlString;

    const fixedAnchors = splitStr.join('id=\"' + tag + '_cite_');

    const htmlStr2 = start + 'id=\"' + tag + '_cite_' + fixedAnchors;

    const [start2, ...splitStr2] = htmlStr2.split('href=\"#cite_');

    if (!splitStr2 || splitStr2.length == 0)
        return htmlStr2;

    const fixedHrefs = splitStr2.join('href=\"#' + tag + '_cite_');

    return start2 + 'href=\"#' + tag + '_cite_' + fixedHrefs;
}


// MW API Calls

// MW API: Scrape list of brands
export async function fetchBrandPages(pageNames: string[]): Promise<ParsedBrandPage[]> {
    const fetchPromises = pageNames.map(brandName => fetchBrandPage(brandName));
    const searchResults = await Promise.all(fetchPromises);
    return searchResults;
}

// MW API: Scrape brand page
export async function fetchBrandPage(pageName: string, revalidate?: boolean): Promise<ParsedBrandPage> {
    var status = 'success';
    const pageResponse = await fetchPageHTMLString(pageName, revalidate);
    if (pageResponse == 'failed')
        status = pageResponse;

    const datatableHTMLString = locateParam(pageResponse, BRAND_HTML_MAP.DATATABLE); // Separate data
    const logoUrl = locateParam(datatableHTMLString, BRAND_HTML_MAP.LOGO_URL);
    const coverUrl = locateParam(datatableHTMLString, BRAND_HTML_MAP.COVER_URL);

    const pageData: ParsedBrandPage = {
        status: 'success',
        id: Number(locateParam(pageResponse, WIKI_HTML_MAP.ID)),
        name: locateParam(pageResponse, WIKI_HTML_MAP.TITLE),
        url_name: encodeURIComponent(pageName),
        logo: {
            url: logoUrl.length > 0 ? (logoUrl.includes('://') ? logoUrl : MW_URL + logoUrl) : '',
        },
        coverImage: {
            url: coverUrl.length > 0 ? (coverUrl.includes('://') ? coverUrl : MW_URL + coverUrl) : '',
            alt: undefined
        },
        owner: adoptLinks(locateParam(datatableHTMLString, BRAND_HTML_MAP.OWNER)),
        industry: locateParam(datatableHTMLString, BRAND_HTML_MAP.INDUSTRY),
        brands: adoptLinks(locateParam(datatableHTMLString, BRAND_HTML_MAP.BRANDS)),
        products: locateParam(datatableHTMLString, BRAND_HTML_MAP.PRODUCTS),
        description: fixReferenceIds(parseWikipediaExcerpts(recontextualizeLinks(locateParam(pageResponse, BRAND_HTML_MAP.SUMMARY)), 'brand'), 'brand'),
        // references: fixReferenceIds(locateParam(pageResponse, BRAND_HTML_MAP.REFERENCES), 'brand_'),
        importedReferences: locateParams(pageResponse, BRAND_HTML_MAP.IMPORTED_REFERENCES).map((str, index) => { return fixReferenceIds(str, 'brand' + index).substring(2) }),
        reportNames: locateParam(pageResponse, BRAND_HTML_MAP.REPORTS).split("title=\"")
            .map((str) => {
                return str.substring(0, str.indexOf("\""));
            }).splice(1),
    };

    if (DEBUG) console.log('[MW-Parse-Brand] Interpreted page data: ', pageData);
    return pageData;
}

// MW API: Scrape report pages
export async function fetchReportPages(pageNames: string[], revalidate?: boolean): Promise<ParsedReportPage[]> {
    const fetchPromises = pageNames.map(pageName => fetchPageHTMLString(pageName, revalidate));
    const pageResponses = await Promise.all(fetchPromises);
    const fetchPreviewPromises = pageNames.map(pageName => fetchPagePlainText(pageName, revalidate));
    const pagePreviewResponses = await Promise.all(fetchPreviewPromises);

    if (DEBUG) { console.log('[MW-Parse-Report] Fetched reports: ', pageResponses); }
    if (DEBUG) { console.log('[MW-Parse-Report] Fetched previews: ', pagePreviewResponses); }


    const reportPageDatas: ParsedReportPage[] = pageResponses.map(
        (pageResponse, index): ParsedReportPage => {
            var status = 'success';
            const dataResponse = locateParam(pageResponse, REPORT_HTML_MAP.DATATABLE);
            const type = locateParam(dataResponse, REPORT_HTML_MAP.TYPE);
            if (pageResponse == 'failed')
                status = pageResponse;
            else if (!Object.keys(REPORT_TYPES).includes(type))
                status = 'malformed';
            return {
                status: status,
                id: Number(locateParam(pageResponse, WIKI_HTML_MAP.ID)),
                title: locateParam(pageResponse, WIKI_HTML_MAP.TITLE),
                type: type,
                timeframe: locateParam(dataResponse, REPORT_HTML_MAP.TIMEFRAME),
                preview: pagePreviewResponses[index],
                content: renderHTMLString(recontextualizeLinks(fixReferenceIds(parseWikipediaExcerpts(locateParam(pageResponse, REPORT_HTML_MAP.CONTENT), 'report'), 'report' + index))),
            };
        }
    );
    if (DEBUG) { console.log('[MW-Parse-Report] Interpreted reports as: '); reportPageDatas.map(item => console.log(item)); }

    return reportPageDatas;
}



function parseWikipediaExcerpts(htmlString: string, refTag: string): string {
    if (htmlString.includes(WE_HEADER)) {
        const [beforeExcerpt, ...excerptSections] = htmlString.split(WE_HEADER); // Split into each excerpt

        if (DEBUG) console.log('[Wikipedia Excerpt] Found excerpts: ', excerptSections.length);

        return beforeExcerpt + WE_HEADER + excerptSections.map((rawExcerptSection, index) => {
            const [beforeImpRefs, afterImpRefs] = rawExcerptSection.split(BRAND_HTML_MAP.IMPORTED_REFERENCES.startToken);
            var excerptSection;
            if (!afterImpRefs)
                excerptSection = beforeImpRefs;
            else
                excerptSection = beforeImpRefs + afterImpRefs.substring(afterImpRefs.indexOf(BRAND_HTML_MAP.IMPORTED_REFERENCES.endToken) + BRAND_HTML_MAP.IMPORTED_REFERENCES.endToken.length);

            // Check paragraph classname
            var paragraphLength = Number(excerptSection.substring(excerptSection.indexOf('num-paragraphs-') + 'num-paragraphs-'.length, excerptSection.indexOf('\"')));
            if (paragraphLength == 0)
                paragraphLength = -1;
            if (DEBUG) console.log('[Wikipedia Excerpt] Paragraph length ', paragraphLength);

            const [excerpt, ...afterExcerpts] = excerptSection.split(WE_END);
            const [beforeP, ...pTags] = excerpt.split('<p');

            const fixedStr = beforeP + pTags.map((pTag) => {
                const [insideP, afterP] = pTag.split('</p>');
                const pContent = insideP.substring(insideP.indexOf('>') + 1);
                if (paragraphLength == 0 || pContent.trim() == '' || pContent.trim() == '<br/>')
                    return '<p style="display:none;" ' + pTag;
                paragraphLength--;
                return '<p ' + pTag;
            }).join('') + WE_END + afterExcerpts.join(WE_END);

            return fixReferenceIds(fixedStr, refTag + index)
        }).join(WE_HEADER);

    }
    return htmlString;
}


// Fetch utilities

// Fetch + delay for testing
const delayFetch = async (url: string, options: any): Promise<Response> =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(fetch(url, options));
        }, SIMULATE_LAG);
    });



// HTML: Expected JSON response object
type MWPageResponse = {
    parse: {
        pageid: number
        title: string
        text: {
            [key: string]: string
        }
    }
}

// HTML: Fetch
async function fetchPageHTMLString(pageName: string, forceRevalidate?: boolean): Promise<string> {
    try {
        const params = new URLSearchParams({ //API Get Params
            action: "parse",
            page: decodeURIComponent(pageName),
            prop: "text",
            format: "json",
            origin: '*'
        });
        if (DEBUG) console.log('[MW-Parse] Fetching page data for \'' + pageName + '\' - ' + `${MW_URL}/w/api.php?${params}`);
        const data = await delayFetch(`${MW_URL}/w/api.php?${params}`, { next: { revalidate: forceRevalidate ? 0 : REVALIDATE_INTERVAL } })
            .then(function (response) {
                return response.json() as Promise<MWPageResponse>
            })
        // if (DEBUG) console.log('[MW-Parse] Found page HTML: ', data.parse.text['*']);

        return WIKI_HTML_MAP.ID.startToken + data.parse.pageid + WIKI_HTML_MAP.ID.endToken + WIKI_HTML_MAP.TITLE.startToken + data.parse.title + WIKI_HTML_MAP.TITLE.endToken + data.parse.text['*']; // embed received metadata in page HTML

    } catch (error) { //TODO: handle errors
        console.error('[MW-Parse] Fetch Error: ', error);
        console.error('[MW-Parse] Failed to load page: ' + pageName);
        return 'failed';
    }
}

// Plain Text: Expected JSON response object
type MWTextExtResponse = {
    query: {
        pages: [{
            pageid: number
            title: string
            extract: string
        }]
    }
}

// Plain Text: Fetch
export async function fetchPagePlainText(pageName: string, forceRevalidate?: boolean): Promise<string> {
    try {
        const params = new URLSearchParams({ //API Get Params
            action: "query",
            titles: decodeURIComponent(pageName),
            prop: "extracts",
            format: "json",
            origin: '*',
            explaintext: 'true'
        });

        if (DEBUG) console.log('[MW-Parse] Fetching previews for \'' + pageName + '\' - ' + `${MW_URL}/w/api.php?${params}`);
        const data = await fetch(`${MW_URL}/w/api.php?${params}`, { next: { revalidate: forceRevalidate ? 0 : REVALIDATE_INTERVAL } })
            .then(function (response) {
                return response.json() as Promise<MWTextExtResponse>
            })
        if (DEBUG) console.log('[MW-Parse] Preview fetch completed:', Object.values(data.query.pages)[0].extract);

        return Object.values(data.query.pages)[0].extract; // Plain text preview

    } catch (error) { //TODO: handle errors
        console.error('[MW-Parse] Fetch Error: ', error);
        console.error('[MW-Parse] Failed to load page: ' + pageName);
        return '';
    }
}



// 
// Search Pages
// 


// Search: Expected JSON response object
type MWSearchResults = {
    query: {
        searchinfo: {},
        search: [{ title: string }]
    }
}

// Search: Fetch
export async function searchBrands(options: { query: string, resultCount: number, resultPage?: number, forceRevalidate?: boolean }): Promise<(string)[]> {
    const params = new URLSearchParams({ //API Get Params
        action: "query",
        formatversion: '2',
        list: "search",
        srlimit: '' + (options.resultCount),
        sroffset: '' + (options.resultPage ? options.resultPage * options.resultCount : 0),
        srsearch: decodeURIComponent(options.query) + ' incategory:\"Brand\"',
        format: "json",
        origin: "*"
    });

    try {
        if (DEBUG) { console.log('[MW-Search] Searching for \'' + options.query + '\' - ' + `${MW_URL}/w/api.php?${params}`); }

        const data = await fetch(`${MW_URL}/w/api.php?${params}`, { next: { revalidate: options.forceRevalidate ? 0 : REVALIDATE_INTERVAL } })
            .then(function (response) {
                return response.json() as Promise<MWSearchResults>
            })

        // if (DEBUG) { console.log('[MW-Search] Raw search response: '); console.log(data); }
        if (DEBUG) { console.log('[MW-Search] Interpreted as: '); console.log(data.query.search.map(item => item.title)); }

        const searchRes = data.query.search.map(item => item.title);

        return searchRes;

    } catch (error) { //TODO: handle errors
        console.error('[MW-Search] Search Error: ', error);
        throw new Error('[MW-Search] Failed to perform search: ' + `${MW_URL}/w/api.php?${params}`);
    }

}



// 
// Credentials
// 



export async function login() {
    getToken();
}


type MWPostResponse = {
    login: {
        result: string
    }
};
async function postRequest(token: string): Promise<string> {
    const params = new URLSearchParams({ //API Get Params
        action: "login",
        format: "json",
    });

    const formData = new URLSearchParams({
        action: "login",
        format: "json",
        lgtoken: token,
        lgname: process.env.BOTUSERNAME ? process.env.BOTUSERNAME : '',
        lgpassword: process.env.BOTPASSWORD ? process.env.BOTPASSWORD : '',
    });

    try {

        const data = await fetch(`${MW_URL}/w/api.php?${params}`, {
            method: 'POST',
            credentials: 'include',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        })
            .then(function (response) {
                return response.json() as Promise<MWPostResponse>
            }).then(async (json) => {
                console.log(await getCsrfToken());
                return json
            })
        console.log('[MW-Login] Login: ', data)
        return data.login.result;

    } catch (error) { //TODO: handle errors
        console.error('[MW-Login] Login error: ', error);
        throw new Error('[MW-Login] Failed to login: ' + `${MW_URL}/w/api.php?${params}`);
    }
}



type MWTokenResponse = {
    query: {
        tokens: {
            logintoken: string
        }
    }
};
async function getToken() {
    const params = new URLSearchParams({ //API Get Params
        action: "query",
        meta: "tokens",
        type: "login",
        format: "json"
    });

    try {
        console.log('[MW-Login] Fetching token: ' + `${MW_URL}/w/api.php?${params}`);

        await fetch(`${MW_URL}/w/api.php?${params}`, { method: 'GET', credentials: 'include' })
            .then((response) => {
                return response.json() as Promise<MWTokenResponse>;
            }).then((data) => {
                postRequest(data.query.tokens.logintoken);
            })

    } catch (error) { //TODO: handle errors
        console.error('[MW-Login] Login error: ', error);
        throw new Error('[MW-Login] Failed get token: ' + `${MW_URL}/w/api.php?${params}`);
    }
}

type MWCsrfTokenResponse = {
    query: {
        tokens: {
            csrftoken: string
        }
    }
};
async function getCsrfToken() {
    const params = new URLSearchParams({ //API Get Params
        action: "query",
        meta: "tokens",
        format: "json"
    });

    try {
        console.log('[MW-Login] Fetching csrf token: ' + `${MW_URL}/w/api.php?${params}`);

        return await fetch(`${MW_URL}/w/api.php?${params}`, { method: 'GET', credentials: 'include' })
            .then((response) => {
                return response.json() as Promise<MWCsrfTokenResponse>;
            }).then((data) => {
                return data.query.tokens.csrftoken;
            })


    } catch (error) { //TODO: handle errors
        console.error('[MW-Login] Login error: ', error);
        throw new Error('[MW-Login] Failed get token: ' + `${MW_URL}/w/api.php?${params}`);
    }
}




// 
// Create Pages
// 

export async function createBrandPage(content: NewBrandPage) {
    const body = content.description ? content.description : `\{\{Wikipedia excerpt\|${content.wikipediaName ? content.wikipediaName : content.name}\|0\|paragraphs=1\}\}`;

    if (DEBUG) { console.log('[MW-Create] Creating page: ', body); }


    const text = `\{\{BrandHeader
        \| logo = ${content.logo}
        \| cover = ${content.coverImage?.url?.substring(content.coverImage?.url?.lastIndexOf('/') + 1)}
        \| coverCaption = ${content.coverImage?.alt}
        \| industry = ${content.industry}
        \| parent = ${content.owner}
        \| brands = ${content.brands}
        \| products = ${content.products}
        \}\}
        \n${body}
        \n
        \n\{\{BrandFooter\}\}`;

    return createPage(content.name, text);
}

export async function createReportPage(content: NewReportPage) {

    const text = `\{\{ReportHeader
        \| type = ${content.type}
        \| timeframe = ${content.timeframe}
        \}\}
        \n
        \n${content.content}`;

    return createPage(content.brandName + '/' + content.title, text);
}


async function createPage(title: string, text: string) {
    const params = new URLSearchParams({ //API Get Params
        action: "edit",
        title: title,
        text: text,
        createonly: 'false',
        format: "json",
        origin: "*"
    });

    try {
        if (DEBUG) { console.log('[MW-Create] Creating page \'' + title + '\' - ' + `${MW_URL}/w/api.php?${params}`); }

        const data = await fetch(`${MW_URL}/w/api.php?${params}`, {})
            .then(function (response) {
                return response.json() as Promise<any>
            })

        if (DEBUG) { console.log('[MW-Create] Response: ', data) }
        console.log(data);
        return data;

    } catch (error) { //TODO: handle errors
        console.error('[MW-Create] Create page error: ', error);
        throw new Error('[MW-Create] Failed to perform creation: ' + `${MW_URL}/w/api.php?${params}`);
    }

}