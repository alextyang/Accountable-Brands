// WikiMedia Commons API

const DEBUG = false;
const WC_URL = 'https://commons.wikimedia.org';

// NOTE: Use separate query for links if necessary: https://commons.wikimedia.org/w/api.php?action=query&titles=File%3AChartres+cathedral+2881.jpg%7CFile%3AChartres+cathedral+2880.jpg%7CFile%3AChartres+cathedral+2879.jpg&prop=imageinfo&iiprop=url

type WCSearchResponse = {
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

export async function searchImages(query: string): Promise<{ title: string, previewUrl: string }[]> {
    try {
        const params = new URLSearchParams({ //API Get Params
            action: "query",
            generator: "search",
            gsrnamespace: '6',
            gsrsearch: query,
            gsrsort: 'relevance',
            gsrlimit: '25',
            prop: 'imageinfo',
            iiprop: 'url|dimensions',
            format: "json"
        });

        if (DEBUG) console.log('[WC-Search] Searching for images for \'' + query + '\' - ' + `${WC_URL}/w/api.php?${params}`);
        const data = await fetch(`${WC_URL}/w/api.php?${params}`, {})
            .then(function (response) {
                return response.json() as Promise<WCSearchResponse>
            })

        return Object.keys(data.query.pages).map((key) => {
            return data.query.pages[key];
        }).sort((a, b) => {

            // DISABLED: Filter out portrait photos
            // if (a.imageinfo.width < a.imageinfo.height)
            //     return b.imageinfo.size;
            // else if (b.imageinfo.width < b.imageinfo.height)
            //     return a.imageinfo.size * -1;

            return b.imageinfo[0].width * b.imageinfo[0].height - a.imageinfo[0].width * a.imageinfo[0].height;
        }).map((item) => {
            return { title: item.title, previewUrl: item.imageinfo[0].url };
        });

    } catch (error) { //TODO: handle errors
        console.error('[WC-Search] Search Error: ', error);
        console.error('[WC-Search] Failed to search: ' + query);
        return [];
    }
}

export async function fetchCommonImageUrl(fileName: string | undefined): Promise<string> {
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

        if (DEBUG) console.log('[WP-Image] Searching for image data for \'' + fileName + '\' - ' + `${WC_URL}/w/api.php?${params}`);
        const data = await fetch(`${WC_URL}/w/api.php?${params}`, {})
            .then(function (response) {

                return response.json() as Promise<WCSearchResponse>
            })
        const key = Object.keys(data.query.pages)[0]
        return data.query.pages[key].imageinfo[0].url;

    } catch (error) { //TODO: handle errors
        console.error('[WP-Image] Fetch Error: ', error);
        console.error('[WP-Image] Failed to load page: ' + fileName);
        return 'failed';
    }
} 