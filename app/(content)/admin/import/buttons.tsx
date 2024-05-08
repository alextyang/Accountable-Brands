"use client";

import { NewBrandPage } from "@/app/data/definitions";
import { Icon } from "@/app/media/icons/interfaceIcons";
import { startTransition, useState } from "react";
import Image from 'next/image'
import { WP_URL, extractWikiLinkNames, extractWikiLinkRefs, fetchPotentialBrandPage } from "@/app/data/wikipedia";
import { convertToXMLFragment, editPageName, getXML, resetPageInfo, setPageInfo, updateImages, updatePageNames } from "./components";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SetPageNames({ oldPageNames, disabled }: { oldPageNames: string[], disabled: boolean }) {
    const [pageNames, setPageNames] = useState(oldPageNames.join('\n'));
    const [isDisabled, setIsDisabled] = useState(disabled);
    const router = useRouter();

    return (

        <textarea className="w-full h-64 p-6 overflow-scroll font-medium border-black bg-tan border-6" defaultValue={pageNames} disabled={isDisabled} onChange={(e) => { setPageNames(e.target.value) }} onKeyDown={async (e) => {

            if (e.key == 'Enter') {
                const newPageNames = pageNames.split('\n');
                const action = updatePageNames.bind(null, newPageNames);
                e.currentTarget.value = e.currentTarget.value.trim();
                setIsDisabled(true);
                await action();
                setIsDisabled(false);
                startTransition(router.refresh);
            }

        }} onPaste={(e) => {

            e.preventDefault();

            let paste = (e.clipboardData || e.clipboardData).getData("text");

            if (paste.includes('[[')) {
                paste = '\n' + extractWikiLinkRefs(paste, false).join('\n').trim();
            }

            e.currentTarget.value = e.currentTarget.value.trim() + paste;

        }} />

    );
}


export function DownloadButton({ xml }: { xml: string }) {
    const router = useRouter();


    const download = (filename: string, text: string) => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

    }

    return (
        <div className="relative flex flex-row items-center justify-center w-full gap-4 cursor-pointer h-9">
            <Icon className="w-16 h-16" name='add-page' onClick={(e) => {
                const action = getXML.bind(null);
                action().then((xml) => { download((xml.split(`<page>`).length - 1) + '_pages.xml', xml); });
                startTransition(router.refresh);
            }}></Icon>
            <p className="text-2xl font-medium">{xml.split(`<page>`).length - 1} Pages</p>
        </div >
    );
}


export function EditName({ pageName }: { pageName: string }) {
    const [newName, setNewName] = useState(pageName);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    return (
        <div className="">
            <Icon className="w-9 h-9 !absolute top-4 right-16 cursor-pointer" name='info' onClick={() => { setIsEditing(true) }}></Icon>
            {isEditing ? (
                <div className="absolute top-0 bottom-0 left-0 right-0 z-20">
                    <textarea className="absolute p-6 overflow-scroll font-medium border-black top-4 bottom-4 left-4 right-4 bg-tan border-6" defaultValue={pageName} onChange={(e) => { setNewName(e.target.value) }} onKeyDown={async (e) => {
                        if (!pageName)
                            return;

                        if (e.key == 'Escape')
                            setIsEditing(false);

                        if (e.key == 'Enter') {
                            setIsEditing(false);

                            const action = editPageName.bind(null, pageName, newName);
                            await action();
                            startTransition(router.refresh);
                        }

                    }} />
                </div>
            ) : ''}

        </div>
    );
}


export function SubmitPage({ pageName }: { pageName: string }) {
    const router = useRouter();

    return (
        <div className="">
            <Icon className="w-9 h-9 !absolute bottom-4 right-4 cursor-pointer" name='add-page' onClick={async (e) => {
                if (pageName) {
                    const action = convertToXMLFragment.bind(null, pageName);
                    await action();
                    startTransition(router.refresh);
                }
            }}></Icon>
        </div>
    );
}

export function OpenWikipediaPage({ pageName }: { pageName: string }) {
    const router = useRouter();

    return (
        <Link className="absolute cursor-pointer w-9 h-9 top-4 left-4" target="_blank" href={WP_URL + '/wiki/' + encodeURIComponent(pageName)} >
            <Icon className="!absolute top-0 left-0 w-9 h-9" name='globe'></Icon>
        </Link>
    );
}

export function EditEntry({ pageInfo }: { pageInfo: NewBrandPage | undefined }) {
    const [jsonObject, setJsonObject] = useState(JSON.stringify(pageInfo, undefined, 4));
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    return (
        <div className="absolute top-0 bottom-0 left-0 right-0 ">
            <Icon className="w-12 h-12 !absolute top-3.5 right-2 cursor-pointer" name='edit-page' onClick={() => { setIsEditing(true) }}></Icon>
            {isEditing ? (
                <div className="absolute top-0 bottom-0 left-0 right-0 z-20">
                    <textarea className="absolute p-6 overflow-scroll font-medium border-black top-4 bottom-4 left-4 right-4 bg-tan border-6" defaultValue={jsonObject} onChange={(e) => { setJsonObject(e.target.value) }} onKeyDown={async (e) => {
                        if (!pageInfo)
                            return;

                        if (e.key == 'Escape')
                            setIsEditing(false);

                        if (e.key == 'Enter') {
                            setIsEditing(false);
                            console.log(jsonObject)

                            const action = setPageInfo.bind(null, pageInfo?.name, jsonObject);
                            const response = await action();
                            setJsonObject(JSON.stringify(response, undefined, 4));

                            startTransition(router.refresh);
                        }

                    }} />
                </div>
            ) : ''}

        </div>
    );
}