"use client";

import { Dispatch, SetStateAction, useState, useTransition } from 'react';
import { setFlag, refreshTable } from '../../../media/utils/iconPicker/actions';
import { usePathname, useRouter } from 'next/navigation';
import { Icon, IconEntryDescription, IconFlag } from '@/app/media/utils/iconPicker/iconDefinitions';

// COMPONENT: Option to refresh icon table
export function RefreshButton({ tableName }: { tableName: string }) {

    const router = useRouter();
    const [isTransitionStarted, startTransition] = useTransition();

    const action = refreshTable.bind(null, tableName);

    return (
        <p className="text-base font-medium opacity-75 cursor-pointer hover:opacity-100 hover:underline" onClick={async () => {
            await action();
            startTransition(router.refresh);
        }}>Refresh</p>
    );
}

// COMPONENT: Switch to icon table
export function SwitchPageButton({ newTableName, readableName }: { newTableName: string, readableName: string }) {

    const router = useRouter();
    const path = usePathname();

    const newPathName = '/admin/' + newTableName;


    return (
        <p className={"text-base font-medium opacity-75 hover:opacity-100 hover:underline cursor-pointer " + (newPathName == path ? ' underline underline-offset-1' : '')} onClick={() => { router.push(newPathName) }}>{readableName}</p>
    );
}

// COMPONENT: Option to lower score of icon error/conflict
export function FlagsButton({ iconKey, flag, desc, color, tableName }: { iconKey: string, flag: IconFlag, desc: IconEntryDescription, color: string, tableName: string }) {

    const router = useRouter();
    const [isTransitionStarted, startTransition] = useTransition();
    const [isSearching, setIsSearching] = useState(false);
    const [replacementIcon, setReplacementIcon] = useState<Icon | undefined>(undefined);



    let buttonStack: {
        borderColor: string;
        iconColor: string;
        hoverIconColor: string;
        bgColor: string;
        flag: IconFlag;
        icon: string;
        viewbox: string;
        color: string;
        title: string;
    }[] = [];

    const buttonDefaults = { borderColor: 'black', iconColor: 'black', hoverIconColor: 'tan', bgColor: 'tan' };

    if (desc.flagRemove)
        buttonStack.push({ flag: 'removed', icon: "M104.695-275.696v-82.869h91.001v82.869h-91.001Zm0-162.869v-82.87h91.001v82.87h-91.001Zm0-162.87v-82.869h91.001v82.869h-91.001Zm171.001 496.74v-91.001h82.869v91.001h-82.869Zm0-659.609v-91.001h82.869v91.001h-82.869Zm162.869 0v-91.001h82.87v91.001h-82.87Zm66.218 659.609-62.935-62.935 143.674-143.674-143.674-143.913 62.935-62.935 143.913 143.674L792.37-518.152l62.935 62.935-143.674 143.913L855.305-167.63l-62.935 62.935-143.674-143.674-143.913 143.674Zm96.652-659.609v-91.001h82.869v91.001h-82.869Zm162.869 162.869v-82.869h91.001v82.869h-91.001ZM104.695-764.304v-91.001h91.001v91.001h-91.001Zm750.61 0h-91.001v-91.001h91.001v91.001Zm-750.61 659.609v-91.001h91.001v91.001h-91.001Z", viewbox: '-40 -1000 1000 1000', color: 'red', title: desc.flagRemove, ...buttonDefaults });
    if (desc.flagSkip)
        buttonStack.push({ flag: 'skipped', icon: "M664.065-224.934v-510.132h91.001v510.132h-91.001Zm-459.131 0v-510.132L587.652-480 204.934-224.934ZM295.935-480Zm0 84.5L423.804-480l-127.869-84.5v169Z", viewbox: '-00 -935 925 935', color: 'yellow', title: desc.flagSkip, ...buttonDefaults });
    if (desc.flagReplaced)
        buttonStack.push({ flag: 'replaced', icon: "M783.522-110.913 529.848-364.587q-29.761 23.044-68.642 36.565-38.88 13.522-83.119 13.522-111.152 0-188.326-77.174Q112.587-468.848 112.587-580q0-111.152 77.174-188.326Q266.935-845.5 378.087-845.5q111.152 0 188.326 77.174Q643.587-691.152 643.587-580q0 44.478-13.522 83.12-13.521 38.641-36.565 68.163l253.913 254.152-63.891 63.652ZM378.087-405.5q72.848 0 123.674-50.826Q552.587-507.152 552.587-580q0-72.848-50.826-123.674Q450.935-754.5 378.087-754.5q-72.848 0-123.674 50.826Q203.587-652.848 203.587-580q0 72.848 50.826 123.674Q305.239-405.5 378.087-405.5Z", viewbox: '-20 -960 960 960', color: 'green', title: desc.flagReplaced, ...buttonDefaults });
    if (desc.flagApprove)
        buttonStack.push({ flag: 'approved', icon: "M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z", viewbox: '0 -960 960 960', color: 'green', title: desc.flagApprove, ...buttonDefaults });

    buttonStack = buttonStack.map((button) => {
        if (button.flag == 'skipped') {
            button.color = 'green'
        }
        if (flag == button.flag) {
            button.bgColor = button.color;
            button.borderColor = button.color;
            button.color = 'tan';
            button.iconColor = 'tan';
            button.hoverIconColor = 'black';
            if (button.flag != 'replaced')
                button.flag = 'none';
        }
        if (isSearching && button.flag == 'replaced') {
            button.icon = "M112.587-152.348v-655.304L889.565-480 112.587-152.348ZM200-283.587 665.152-480 200-676.413v132.826L443.587-480 200-416.413v132.826Zm0 0v-392.826 392.826Z";
            button.viewbox = '-90 -1025 1150 1100';
            button.title = 'Replace icon';
        }
        return button;
    });




    return (
        <div className="flex flex-row cursor-pointer" >
            <p className='hidden bg-red bg-yellow bg-green bg-black border-red border-yellow border-green border-black text-red text-yellow text-green text-black hover:bg-red hover:bg-yellow hover:bg-green hover:bg-tan hover:border-red hover:border-yellow hover:border-green hover:border-black hover:text-black hover:text-tan hover:text-red hover:text-yellow hover:text-green fill-[currentColor] '></p>
            {
                isSearching ? (
                    <IconSearchWidget setReplacementIcon={setReplacementIcon} />
                ) : undefined
            }
            {
                buttonStack.map((button) => {
                    if (isSearching && button.flag != 'replaced')
                        return;
                    return (
                        <div className={"w-8 h-8 z-20 flex items-center justify-center border-y-4 first-of-type:border-l-4 first-of-type:pr-1 last:border-r-4 last:pl-1 hover:z-30 bg-" + button.bgColor + " hover:bg-" + button.color + " border-" + button.borderColor + " hover:border-" + button.color + " text-" + button.iconColor + " hover:text-" + button.hoverIconColor} key={button.flag + iconKey} title={button.title} onClick={async () => {
                            if (button.flag == 'replaced' && !isSearching)
                                return setIsSearching(true);
                            else if (button.flag == 'replaced' && isSearching) {
                                setIsSearching(false);
                                if (!replacementIcon)
                                    return;
                            }

                            const action = setFlag.bind(null, tableName, iconKey, button.flag as IconFlag, replacementIcon);
                            await action();
                            startTransition(router.refresh);
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox={button.viewbox} width="24" className='fill-[currentColor] '><path d={button.icon} /></svg>
                        </div>
                    )
                })
            }</div>
    );
}



import Fuse, { FuseResult } from "fuse.js"; // Search Lib
import icons from "@/icons.json"; // SVG Paths
const industryIcons = icons as Icon[];

const fuseProductOptions = {
    shouldSort: true,
    includeScore: true,
    ignoreLocation: true,
    ignoreFieldNorm: true,
    keys: ["name"],
};
const fuseProductsSearch = new Fuse(industryIcons, fuseProductOptions);

function IconSearchWidget({ setReplacementIcon }: { setReplacementIcon: Dispatch<SetStateAction<Icon | undefined>> }) {
    const [searchResults, setSearchResults] = useState<FuseResult<Icon>[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <div className='relative flex items-center justify-center w-32 h-8 border-l-4 border-black border-y-4 '>
            <input type="text" value={searchQuery} className='absolute top-0 bottom-0 left-0 right-0 p-2 pr-0 border-none bg-tan' onChange={(e) => {
                if (searchQuery != e.target.value)
                    setSearchQuery(e.target.value);
                setSearchResults(fuseProductsSearch.search(e.target.value));
            }} />
            <div className='absolute z-30 flex flex-col border-b-4 border-black top-6 -left-1 -right-8 border-x-4 bg-tan '>
                {
                    searchResults.map((result, index) => {
                        const icon = result.item;
                        return (
                            <div className='relative w-full h-12 border-t-4 border-black cursor-pointer hover:text-tan hover:bg-black' key={result.item.name} onClick={() => {
                                setReplacementIcon(result.item);
                                setSearchResults([]);
                                setSearchQuery(result.item.name);
                            }}>
                                <svg className={' mt-1 ml-1 fill-[currentColor]'} xmlns="http://www.w3.org/2000/svg" height='34' width='34' viewBox={icon?.viewbox ? icon.viewbox : "0 -960 960 960"}><path d={icon?.path} /></svg>
                                <div className='absolute top-2 left-[44px] bottom-0 right-2 overflow-hidden'>
                                    <p className=" text-[9px] leading-none line-clamp-2 ">{icon?.name}</p>
                                    <ScoreIcon className="absolute text-xs opacity-60 bottom-2 " score={result.score}></ScoreIcon>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}


// COMPONENT: Small visual indicator of a score's confidence
function ScoreIcon({ className, score }: { className: string, score?: number }) {
    if (!score) return '';
    var color = 'green';
    if (score > 0.25)
        color = 'red';

    return (<div className={className + ' w-12 h-1.5 border-2 border-' + color + ' '}>
        <div style={{ width: ((1 - score) * 100) + '%' }} className={"bg-" + color + " absolute left-0 top-0 bottom-0"}>

        </div>
    </div>);

} 