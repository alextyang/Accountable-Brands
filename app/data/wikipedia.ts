// API for importing Wikipedia data

import { NewBrandPage } from "./definitions";
import { searchImages } from "./wikimedia";

const DEBUG = false;
export const WP_URL = 'https://en.wikipedia.org';

const PARAM_NAMES = { // Infobox labels to try for certain attributes
    NAME: ['name'],
    BRANDS: ['brands', 'subsid', 'subsidiaries'],
    PRODUCTS: ['products', 'services'],
    OWNER: ['owner'],
    PARENT: ['parent'],
    INDUSTRY: ['industry', 'industries']
}

const PARSE_PARAMS = 'wikitext|images';
type WPParseResponse = {
    parse: {
        title: string,
        pageid: number,
        images: string[],
        wikitext: {
            '*': string
        }
    }
};

export async function fetchPotentialBrandPage(pageName: string) {
    try {
        const params = new URLSearchParams({ //API Get Params
            action: "parse",
            page: decodeURIComponent(pageName),
            prop: PARSE_PARAMS,
            format: "json",
            origin: '*'
        });

        if (DEBUG) console.log('[WP-Parse] Fetching page data for \'' + pageName + '\' - ' + `${WP_URL}/w/api.php?${params}`);
        const data = await fetch(`${WP_URL}/w/api.php?${params}`, {})
            .then(function (response) {

                return response.json() as Promise<WPParseResponse>
            })
        return mapResponseToBrandPage(data);

    } catch (error) { //TODO: handle errors
        console.error('[WP-Parse] Fetch Error: ', error);
        console.error('[WP-Parse] Failed to load page: ' + pageName);
        return undefined;
    }
}

async function mapResponseToBrandPage(response: WPParseResponse): Promise<NewBrandPage | undefined> {
    if (!response || !response.parse)
        return undefined;

    const name = response.parse.title;
    const text = response.parse.wikitext['*'];

    // Isolate {{Infobox ... }} wiki template
    const infoboxStart = text.substring(text.indexOf('{{Infobox'));

    let infobox = '';
    let openBrackets = 0;
    let index = 0;
    while ((openBrackets > 0 || index == 0) && index < infoboxStart.length) {
        if (infoboxStart[index] == '{')
            openBrackets++;
        else if (infoboxStart[index] == '}')
            openBrackets--;

        infobox += infoboxStart[index];
        index++;
    }

    const commonName = guessCommonName(infobox, name);
    const coverImage = await guessCoverImage(commonName);
    const logo = await extractWikitextParameter(infobox, 'logo');

    return {
        status: 'pending',
        name: commonName,
        wikipediaName: name,
        logo: {
            url: logo,
            previewUrl: await fetchPreviewUrl(logo)
        },
        coverImage: {
            url: coverImage?.url,
            previewUrl: coverImage?.previewUrl
        },
        owner: guessOwner(infobox),
        products: guessProducts(infobox),
        brands: guessBrands(infobox),
        industry: guessIndustry(infobox)
    }
}

function extractWikitextParameter(str: string, paramName: string): string {
    if (!str.includes(paramName))
        return '';

    const extractStart = str.substring(
        str.indexOf(paramName + ' = ') + (paramName + ' = ').length);

    let extract = '';
    let openBrackets = 0;
    let index = 0;
    while (index < extractStart.length) {
        if (extractStart[index] == '|' && openBrackets == 0)
            break;
        else if (extractStart[index] == '[' || extractStart[index] == '{')
            openBrackets++;
        else if (extractStart[index] == ']' || extractStart[index] == '}')
            openBrackets--;

        extract += extractStart[index];
        index++;
    }

    return extract.length > 0 ? extract.replaceAll('\n', '').trim() : '';
}

function extractWikitextParameters(str: string, ...paramNames: string[]): string {
    return paramNames.map((param) => {
        return extractWikitextParameter(str, param)
    }).join(' ').trim();
}

function extractWikiLinks(str: string, relink: boolean): string[] {
    if (!str)
        return [];

    const [_, ...links] = str.split('[[').map((linkItem) => {
        if (linkItem.indexOf('|') < linkItem.indexOf(']]'))
            return linkItem.substring(linkItem.indexOf('|') + 1, linkItem.indexOf(']]'));
        return linkItem.substring(0, linkItem.indexOf(']]'));
    });

    return links.map((link) => {
        if (relink)
            return '[[' + link + ']]';
        return link;
    });
}

async function guessCoverImage(commonName: string): Promise<{ url: string, previewUrl: string } | undefined> {
    const coverImages = await searchImages(commonName);

    while (coverImages.length > 0 &&
        (coverImages[0].title.toLocaleLowerCase().includes('logo')
            || coverImages[0].title.toLocaleLowerCase().includes('icon')
            || coverImages[0].title.toLocaleLowerCase().includes('headquarters')
            || coverImages[0].title.toLocaleLowerCase().includes('.svg')
            || coverImages[0].title.toLocaleLowerCase().includes(' hq ')
        ))
        coverImages.shift();
    return { url: coverImages[0].title.substring('File:'.length), previewUrl: coverImages[0].previewUrl };
}

function guessProducts(infobox: string): string {
    const products = extractWikiLinks(extractWikitextParameters(infobox, ...PARAM_NAMES.PRODUCTS), false);
    return products.join('  •  ');
}

function guessBrands(infobox: string): string {
    const brands = extractWikiLinks(
        extractWikitextParameters(infobox, ...PARAM_NAMES.BRANDS), false
    );
    return brands.join('  •  ');
}

function guessIndustry(infobox: string): string {
    let industry = extractWikiLinks(extractWikitextParameters(infobox, ...PARAM_NAMES.INDUSTRY), false);

    if (industry.length > 0)
        return industry.join(' • ');
    return '';
}

function guessOwner(infobox: string): string {
    let owner = extractWikiLinks(extractWikitextParameters(infobox, ...PARAM_NAMES.OWNER), false);
    let parent = extractWikiLinks(extractWikitextParameters(infobox, ...PARAM_NAMES.PARENT), false);

    if (parent.length > 0 && owner.length > 0)
        return parent + ' ➔ ' + owner;
    if (owner.length > 0)
        return ' ➔ ' + owner.join(' • ');
    if (parent.length > 0)
        return ' ➔ ' + parent.join(' • ');
    return '';
}

function guessCommonName(infobox: string, backup: string): string {
    const companyName = extractWikitextParameters(infobox, ...PARAM_NAMES.NAME);
    const shortenedBackup = backup.includes('(') ? backup.substring(0, backup.indexOf('(')) : backup;

    return (companyName.length > 0 && companyName.length < backup.length) ? companyName : shortenedBackup;
}


type WPImageSearchResponse = {
    query: {
        pages: {
            [key: string]: {
                title: string,
                pageid: number
                imageinfo: {
                    url: string,
                    size: number,
                    width: number,
                    height: number
                }[]
            }
        }
    }
};

export async function fetchPreviewUrl(fileName: string | undefined): Promise<string> {
    if (!fileName)
        return '';

    try {
        const params = new URLSearchParams({ //API Get Params
            action: "query",
            generator: "search",
            gsrnamespace: '6',
            gsrsearch: fileName,
            gsrsort: 'relevance',
            gsrlimit: '1',
            prop: 'imageinfo',
            iiprop: 'url',
            format: "json"
        });

        if (DEBUG) console.log('[WP-Image] Searching for image data for \'' + fileName + '\' - ' + `${WP_URL}/w/api.php?${params}`);
        const data = await fetch(`${WP_URL}/w/api.php?${params}`, {})
            .then(function (response) {

                return response.json() as Promise<WPImageSearchResponse>
            })
        const key = Object.keys(data.query.pages)[0]
        return data.query.pages[key].imageinfo[0].url;

    } catch (error) { //TODO: handle errors
        console.error('[WP-Image] Fetch Error: ', error);
        console.error('[WP-Image] Failed to load page: ' + fileName);
        return '';
    }
} 