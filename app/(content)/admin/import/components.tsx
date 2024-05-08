"use server";


import { fetchPotentialBrandPage, fetchPreviewUrl } from "@/app/data/wikipedia";
import Image from 'next/image'
import { DownloadButton, EditEntry, EditName, OpenWikipediaPage, SetPageNames, SubmitPage } from "./buttons";
import { NewBrandPage } from "@/app/data/definitions";
import { ErrorBoundary, ErrorComponent } from "next/dist/client/components/error-boundary";
import NewPageError from "./error";
import { fetchCommonImageUrl as fetchCommonsImageUrl } from "@/app/data/wikimedia";
import { createBrandPage } from "@/app/data/mediawiki";

const pageNames: string[] = [];
const pageInfos: (NewBrandPage | undefined)[] = [];
let workingXML: string = '';



export async function PotentialBrandPageList({ }: {}) {

    return (
        <div className="flex flex-row flex-wrap gap-6 p-12">
            <DownloadButton xml={workingXML} />
            <p className="mx-auto text-2xl font-medium">&nbsp;&nbsp;•&nbsp;&nbsp;</p>
            <p className="mx-auto text-2xl font-medium">&nbsp;&nbsp;➔&nbsp;&nbsp;</p>
            <SetPageNames oldPageNames={pageNames} disabled={(workingXML.length > 0)} />
            {pageNames.map((pageName, index) => {
                if (pageName.trim().length == 0)
                    return '';
                return (
                    <div key={pageName} className="w-full p-6 border-black border-6 min-w-[36rem] relative">
                        <ErrorBoundary errorComponent={NewPageError}>
                            <PotentialBrandPage index={index} />
                        </ErrorBoundary>
                        <EditName pageName={pageName} />
                        <SubmitPage pageName={pageName} />
                        <OpenWikipediaPage pageName={pageName} />
                    </div>
                )
            })}
        </div>
    );

}

export async function PotentialBrandPage({ index }: { index: number }) {

    let pageInfo;
    if (pageInfos.length <= index || !pageInfos[index])
        pageInfos[index] = await fetchPotentialBrandPage(pageNames[index]) as NewBrandPage;
    pageInfo = pageInfos[index];

    if (!pageInfo || !pageInfo.name || pageInfo.name.trim().length < 1)
        return '';

    return (

        <div className="flex flex-row gap-6">
            <div className="relative flex flex-row items-center justify-center h-auto cursor-pointer min-w-64 aspect-square">
                <div className="relative w-1/2 h-1/2">
                    <Image className="object-contain" fill src={pageInfo?.logo.previewUrl ? pageInfo?.logo.previewUrl : ''} alt='' />
                </div>
                <Image className="object-cover opacity-80 mix-blend-soft-light -z-10" fill src={pageInfo?.coverImage?.previewUrl ? pageInfo?.coverImage.previewUrl : ''} alt='' />
            </div>
            <div className="flex flex-col h-auto gap-1">
                <h1 className="text-2xl">{pageInfo?.name}</h1>
                <h2 className="mb-1 text-xl">{pageInfo?.industry}</h2>
                <p className="block"><b>Owner: </b>{pageInfo?.owner}</p>
                <p className="block"><b>Products: </b>{pageInfo?.products}</p>
                <p className="block"><b>Brands: </b>{pageInfo?.brands}</p>
            </div>
            <EditEntry pageInfo={pageInfo} />
        </div>

    );

}


export async function updatePageNames(inPageNames: string[]) {
    pageNames.length = 0;
    pageInfos.length = 0;
    pageNames.push(...inPageNames);
    return '';
}

export async function getXML(): Promise<string> {
    const xml = `<mediawiki xmlns="http://www.mediawiki.org/xml/export-0.11/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.mediawiki.org/xml/export-0.11/ http://www.mediawiki.org/xml/export-0.11.xsd" version="0.11" xml:lang="en">
    <siteinfo>
      <sitename>Accountable Brands</sitename>
      <dbname>my_wiki</dbname>
      <base>https://collab.accountablebrand.org/wiki/Main_Page</base>
      <generator>MediaWiki 1.41.0</generator>
      <case>first-letter</case>
      <namespaces>
        <namespace key="-2" case="first-letter">Media</namespace>
        <namespace key="-1" case="first-letter">Special</namespace>
        <namespace key="0" case="first-letter" />
        <namespace key="1" case="first-letter">Talk</namespace>
        <namespace key="2" case="first-letter">User</namespace>
        <namespace key="3" case="first-letter">User talk</namespace>
        <namespace key="4" case="first-letter">Project</namespace>
        <namespace key="5" case="first-letter">Project talk</namespace>
        <namespace key="6" case="first-letter">File</namespace>
        <namespace key="7" case="first-letter">File talk</namespace>
        <namespace key="8" case="first-letter">MediaWiki</namespace>
        <namespace key="9" case="first-letter">MediaWiki talk</namespace>
        <namespace key="10" case="first-letter">Template</namespace>
        <namespace key="11" case="first-letter">Template talk</namespace>
        <namespace key="12" case="first-letter">Help</namespace>
        <namespace key="13" case="first-letter">Help talk</namespace>
        <namespace key="14" case="first-letter">Category</namespace>
        <namespace key="15" case="first-letter">Category talk</namespace>
        <namespace key="828" case="first-letter">Module</namespace>
        <namespace key="829" case="first-letter">Module talk</namespace>
      </namespaces>
    </siteinfo>
    ${workingXML}
    </mediawiki>`;

    workingXML = '';
    return xml;
}


export async function convertToXMLFragment(pageName: string) {

    const index = pageNames.indexOf(pageName);
    const content = pageInfos[index];

    if (!content)
        return '';

    const body = content.description ? content.description : `{{Wikipedia excerpt|${content.wikipediaName ? content.wikipediaName : content.name}|0|paragraphs=1}}`;

    console.log('[MW-Create] Creating XML page: ', body);

    const text = `
    <page>
        <title>${content.name}</title>
        <ns>0</ns>
        <revision>
            <contributor>
                <username>Admin</username>
                <id>1</id>
            </contributor>
            <model>wikitext</model>
            <format>text/x-wiki</format>
            <text xml:space="preserve">
                {{BrandHeader
                    | logo = ${content.logo.url}
                    | cover = ${content.coverImage?.url?.substring(content.coverImage?.url?.lastIndexOf('/') + 1)}
                    | coverCaption = ${content.coverImage?.alt}
                    | industry = ${content.industry}
                    | parent = ${content.owner}
                    | brands = ${content.brands}
                    | products = ${content.products}
                    }}
                    \n${body}
                    \n
                    \n{{BrandFooter}}
            </text>
        </revision>
    </page>`;

    workingXML = (workingXML + text).replaceAll('undefined', '').replaceAll('&', '&amp;');

    pageNames.splice(index, 1);
    pageInfos.splice(index, 1);

    return text;

}

// export async function submitPage(pageName: string) {
//     const index = pageNames.indexOf(pageName);
//     const pageInfo = pageInfos[index];

//     // login();

//     if (pageInfo) {
//         await createBrandPage(pageInfo);

//         pageNames.splice(index, 1);
//         pageInfos.splice(index, 1);
//     }
//     return '';
// 
// }

export async function editPageName(oldPageName: string, inPageName: string) {
    const index = pageNames.indexOf(oldPageName);
    pageNames[index] = inPageName;
    return await resetPageInfo(inPageName);
}

export async function setPageInfo(pageName: string, pageInfo: string) {
    const index = pageNames.indexOf(pageName);
    pageInfos[index] = JSON.parse(pageInfo);
    await updateImages(pageName);
    return pageInfos[index];
}

export async function resetPageInfo(pageName: string) {
    const index = pageNames.indexOf(pageName);
    pageInfos[index] = await fetchPotentialBrandPage(pageName);
    return pageName;
}

export async function updateImages(pageName: string) {
    const index = pageNames.indexOf(pageName);
    const page = pageInfos[index];

    if (page == undefined)
        return resetPageInfo(pageName);

    page.logo.previewUrl = await fetchPreviewUrl(page.logo.url);
    page.coverImage.previewUrl = await fetchCommonsImageUrl(page.coverImage.url);
    return pageName;
}