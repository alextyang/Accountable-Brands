
import parseHTML from 'html-react-parser';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purifyHTML = DOMPurify(window);


function renderHTMLString(str?: string): string | JSX.Element | JSX.Element[] {
    return parseHTML(purifyHTML.sanitize(str ? str : ''));
}

import { B_URL, BrandPage, DEBUG, MW_URL, ReportPage, SIMULATE_LAG, REVALIDATE_INTERVAL, REPORT_TYPES } from './definitions'



type HTMLStringLocation = { // Utility type for parsing MediaWiki pages
    startToken: string,
    endToken: string,
    lastOccurance?: boolean
}

const WIKI_HTML_MAP = { // Basic page information spots
    ID: { startToken: "<!-- dbpageid: ", endToken: "bpid--> " },
    TITLE: { startToken: "<!-- dbpagetitle: ", endToken: "bpt--> " },
};




const BRAND_HTML_MAP = { // Company/Organization page HTML structure
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

    REFERENCES: {
        startToken: "<div class=\"mw-references-wrap\">",
        endToken: "</div>",
    },

    IMPORTED_REFERENCES: {
        startToken: "<div class=\"mw-references-wrap mw-references-columns\">",
        endToken: "</div>",
    },
}

export async function fetchBrandPages(pageNames: string[]): Promise<BrandPage[]> {
    const fetchPromises = pageNames.map(brandName => fetchBrandPage(brandName));
    const searchResults = await Promise.all(fetchPromises);
    return searchResults;
}

export async function fetchBrandPage(pageName: string, revalidate?: boolean): Promise<BrandPage> {
    var status = 'success';
    const pageResponse = await fetchPageHTMLString(pageName, revalidate);
    if (pageResponse == 'failed')
        status = pageResponse;

    const datatableHTMLString = locateParam(pageResponse, BRAND_HTML_MAP.DATATABLE); // Separate data
    // if (DEBUG) { console.log('[MediaWiki] Recieved string: ', {pageResponse}); }
    // console.log('[MediaWiki] Recieved string: ', pageResponse);
    const logoUrl = locateParam(datatableHTMLString, BRAND_HTML_MAP.LOGO_URL);
    const coverUrl = locateParam(datatableHTMLString, BRAND_HTML_MAP.COVER_URL);

    const pageData: BrandPage = { // TODO: Catch errors
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
        description: parseWikipediaExcerpts(recontextualizeLinks(locateParam(pageResponse, BRAND_HTML_MAP.SUMMARY))),
        references: fixReferenceIds(locateParam(pageResponse, BRAND_HTML_MAP.REFERENCES)),
        importedReferences: locateParams(pageResponse, BRAND_HTML_MAP.IMPORTED_REFERENCES).map(str => { return fixReferenceIds(str) }),
        reportNames: locateParam(pageResponse, BRAND_HTML_MAP.REPORTS).split("title=\"")
            .map((str) => {
                return str.substring(0, str.indexOf("\""));
            }).splice(1),
    };

    // console.log('[MediaWiki] Interpreted page data: ', pageData);
    return pageData;
}



const REPORT_HTML_MAP = { // MediaWiki report page HTML structure
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

export async function fetchReportPages(pageNames: string[], revalidate?: boolean): Promise<ReportPage[]> {
    const fetchPromises = pageNames.map(pageName => fetchPageHTMLString(pageName, revalidate));
    const pageResponses = await Promise.all(fetchPromises);
    const fetchPreviewPromises = pageNames.map(pageName => fetchPagePlainText(pageName, revalidate));
    const pagePreviewResponses = await Promise.all(fetchPreviewPromises);

    // if (DEBUG) { console.log('[MediaWiki] Fetched reports: '); console.log(pageResponses); }
    // if (DEBUG) { console.log('[MediaWiki] Fetched previews: '); console.log(pagePreviewResponses); }


    const reportPageDatas: ReportPage[] = pageResponses.map(
        (pageResponse, index): ReportPage => {
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
                content: renderHTMLString(recontextualizeLinks(parseWikipediaExcerpts(locateParam(pageResponse, REPORT_HTML_MAP.CONTENT)))),
            };
        }
    );
    // if (DEBUG) { console.log('[MediaWiki] Interpreted reports as: '); reportPageDatas.map(item => console.log(item)); }



    return reportPageDatas;
}


function locateParam(htmlString: string, paramLoc: HTMLStringLocation): string {
    const afterStr = htmlString.substring(
        (paramLoc.lastOccurance ? htmlString.lastIndexOf(paramLoc.startToken) : htmlString.indexOf(paramLoc.startToken))
        + paramLoc.startToken.length);

    if (htmlString.indexOf(paramLoc.startToken) == -1 || afterStr.indexOf(paramLoc.endToken) == -1)
        return '';

    return afterStr.substring(0,
        afterStr.indexOf(paramLoc.endToken)
    ).trim();
}

function locateParams(htmlString: string, paramLoc: HTMLStringLocation): string[] {
    const [first, ...splitStr] = htmlString.split(paramLoc.startToken);
    if (splitStr && splitStr.length > 0) {
        return splitStr.map(str => {
            return locateParam(paramLoc.startToken + str, paramLoc);
        });
    }
    return [];
}

const WE_HEADER = 'class=\"card wikipedia-excerpt';
const WE_END = 'class=\"card-border';

function parseWikipediaExcerpts(htmlString: string): string {
    if (htmlString.includes(WE_HEADER)) {
        const [beforeExcerpt, ...excerptSections] = htmlString.split(WE_HEADER); // Split into each excerpt
        // console.log('[Wikipedia Excerpt] Found excerpts: ', excerptSections.length);

        return beforeExcerpt + WE_HEADER + excerptSections.map((rawExcerptSection, index) => {
            const [beforeRefs, afterRefs] = rawExcerptSection.split(BRAND_HTML_MAP.IMPORTED_REFERENCES.startToken);
            const excerptSection = beforeRefs + afterRefs.substring(afterRefs.indexOf(BRAND_HTML_MAP.IMPORTED_REFERENCES.endToken) + BRAND_HTML_MAP.IMPORTED_REFERENCES.endToken.length);

            // Check paragraph classname
            var paragraphLength = Number(excerptSection.substring(excerptSection.indexOf('num-paragraphs-') + 'num-paragraphs-'.length, excerptSection.indexOf('\"')));
            if (paragraphLength == 0)
                paragraphLength = -1;
            // console.log('[Wikipedia Excerpt] Paragraph length ', paragraphLength);

            const [excerpt, ...afterExcerpts] = excerptSection.split(WE_END);
            const [beforeP, ...pTags] = excerpt.split('<p');

            return beforeP + pTags.map((pTag) => {
                const [insideP, afterP] = pTag.split('</p>');
                const pContent = insideP.substring(insideP.indexOf('>') + 1);
                if (paragraphLength == 0 || pContent.trim() == '' || pContent.trim() == '<br/>')
                    return '<p style="display:none;" ' + pTag;
                paragraphLength--;
                return '<p ' + pTag;
            }).join('') + WE_END + afterExcerpts.join(WE_END);
        }).join(WE_HEADER);

    }
    return htmlString;
}



type MWPageResponse = { //Define expected JSON response object
    parse: {
        pageid: number
        title: string
        text: {
            [key: string]: string
        }
    }
}

const delayFetch = async (url: string, options: any): Promise<Response> =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(fetch(url, options));
        }, SIMULATE_LAG);
    });

async function fetchPageHTMLString(pageName: string, forceRevalidate?: boolean): Promise<string> {
    try {
        const params = new URLSearchParams({ //API Get Params
            action: "parse",
            page: decodeURIComponent(pageName),
            prop: "text",
            format: "json",
            origin: '*'
        });
        if (DEBUG) console.log('[MediaWiki] Fetching page data for \'' + pageName + '\' - ' + `${MW_URL}/w/api.php?${params}`);
        const data = await delayFetch(`${MW_URL}/w/api.php?${params}`, { next: { revalidate: forceRevalidate ? 0 : REVALIDATE_INTERVAL } })
            .then(function (response) {
                return response.json() as Promise<MWPageResponse>
            })
        // console.log('[MediaWiki] Page fetch completed.');
        if (DEBUG) console.log('[MediaWiki] Found page HTML: ', data.parse.text['*']);

        return WIKI_HTML_MAP.ID.startToken + data.parse.pageid + WIKI_HTML_MAP.ID.endToken + WIKI_HTML_MAP.TITLE.startToken + data.parse.title + WIKI_HTML_MAP.TITLE.endToken + data.parse.text['*']; // embed received metadata in page HTML

    } catch (error) { //TODO: handle errors
        console.error('[MediaWiki] Fetch Error: ', error);
        console.error('[MediaWiki] Failed to load page: ' + pageName);
        return 'failed';
    }
}

type MWTextExtResponse = { //Define expected JSON response object
    query: {
        pages: [{
            pageid: number
            title: string
            extract: string
        }]
    }
}

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

        if (DEBUG) console.log('[MediaWiki] Fetching previews for \'' + pageName + '\' - ' + `${MW_URL}/w/api.php?${params}`);
        const data = await fetch(`${MW_URL}/w/api.php?${params}`, { next: { revalidate: forceRevalidate ? 0 : REVALIDATE_INTERVAL } })
            .then(function (response) {
                return response.json() as Promise<MWTextExtResponse>
            })
        if (DEBUG) console.log('[MediaWiki] Preview fetch completed:', Object.values(data.query.pages)[0].extract);

        return Object.values(data.query.pages)[0].extract; // Plain text preview

    } catch (error) { //TODO: handle errors
        console.error('[MediaWiki] Fetch Error: ', error);
        console.error('[MediaWiki] Failed to load page: ' + pageName);
        return '';
    }
}


function recontextualizeLinks(htmlString: string): string { // fixes mediawiki-specific links
    return htmlString.replaceAll('\'/wiki/', '\'' + MW_URL + '/wiki/').replaceAll('\"/wiki/', '\"' + MW_URL + '/wiki/').replaceAll(' /wiki/', ' ' + MW_URL + '/wiki/').replaceAll('\'/w/', '\'' + MW_URL + '/w/').replaceAll('\"/w/', '\"' + MW_URL + '/w/').replaceAll(' /w/', ' ' + MW_URL + '/w/'); //TODO Regex
}

function adoptLinks(htmlString: string): string {
    return htmlString.replaceAll('/w/', B_URL + '/b/');
}

function fixReferenceIds(htmlString: string): string {
    const [start, ...splitStr] = htmlString.split('li id=\"');

    if (!splitStr || splitStr.length == 0)
        return htmlString;

    const fixedStr = splitStr.map(str => {
        const id = str.substring(0, str.indexOf('"'));
        return id + '" name="' + str;
    }).join('li id=\"');

    // console.log(fixedStr);
    return start + 'li id=\"' + fixedStr;
}


type MWSearchResults = { // Structure of search response
    query: {
        searchinfo: {},
        search: [{ title: string }]
    }
}

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
        if (DEBUG) { console.log('[MediaWiki] Searching for \'' + options.query + '\' - ' + `${MW_URL}/w/api.php?${params}`); }

        const data = await fetch(`${MW_URL}/w/api.php?${params}`, { next: { revalidate: options.forceRevalidate ? 0 : REVALIDATE_INTERVAL } })
            .then(function (response) {
                return response.json() as Promise<MWSearchResults>
            })

        if (DEBUG) { console.log('[MediaWiki] Raw search response: '); console.log(data); }
        if (DEBUG) { console.log('[MediaWiki] Iterpreted as: '); console.log(data.query.search.map(item => item.title)); }

        const searchRes = data.query.search.map(item => item.title);

        return searchRes;

    } catch (error) { //TODO: handle errors
        console.error('[MediaWiki] Search Error: ', error);
        throw new Error('[MediaWiki] Failed to perform search: ' + `${MW_URL}/w/api.php?${params}`);
    }

}


const isValidUrl = (urlString: string) => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}