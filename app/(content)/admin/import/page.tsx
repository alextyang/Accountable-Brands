"use server";

import { fetchPotentialBrandPage, fetchPreviewUrl } from "@/app/data/wikipedia";
import Image from 'next/image'
import { EditEntry, EditName, OpenWikipediaPage, SetPageNames, SubmitPage } from "./edit";
import { NewBrandPage } from "@/app/data/definitions";
import { ErrorBoundary, ErrorComponent } from "next/dist/client/components/error-boundary";
import NewPageError from "./error";
import { fetchCommonImageUrl as fetchCommonsImageUrl } from "@/app/data/wikimedia";
import { createBrandPage, login } from "@/app/data/mediawiki";


const pageNames: string[] = ['T-Mobile US'];
const pageInfos: (NewBrandPage | undefined)[] = [];


export default async function Page({ params }: { params: {} }) {

    return (
        <PotentialBrandPageList />
    );
}

export async function PotentialBrandPageList({ }: {}) {

    return (
        <div className="flex flex-row flex-wrap gap-6 p-12">
            <SetPageNames oldPageNames={pageNames} />
            {pageNames.map((pageName, index) => {
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

    if (!pageInfo)
        return '';


    return (

        <div className="flex flex-row gap-6">
            <div className="relative flex flex-row items-center justify-center h-auto min-w-64 aspect-square">
                <div className="relative w-3/4 h-3/4">
                    <Image className="object-contain" fill src={pageInfo?.logo.previewUrl ? pageInfo?.logo.previewUrl : ''} alt='' />
                </div>
                <Image className="object-cover opacity-50 mix-blend-soft-light -z-10" fill src={pageInfo?.coverImage?.previewUrl ? pageInfo?.coverImage.previewUrl : ''} alt='' />
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
    pageNames.push(...inPageNames);
    return '';
}

export async function submitPage(pageName: string) {
    const index = pageNames.indexOf(pageName);
    const pageInfo = pageInfos[index];

    login();

    // if (pageInfo) {
    //     await createBrandPage(pageInfo);

    //     pageNames.splice(index, 1);
    //     pageInfos.splice(index, 1);
    // }
    return '';

}

export async function editPageName(oldPageName: string, inPageName: string) {
    const index = pageNames.indexOf(oldPageName);
    pageNames[index] = inPageName;
    return await resetPageInfo(inPageName);
}

export async function setPageInfo(pageName: string, pageInfo: string) {
    const index = pageNames.indexOf(pageName);
    pageInfos[index] = JSON.parse(pageInfo);
    return await updateImages(pageName);
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