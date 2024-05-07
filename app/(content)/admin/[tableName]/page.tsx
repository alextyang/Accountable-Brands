"use server";

import { BAD_SCORE_CUTOFF, GOOD_SCORE_CUTOFF } from "@/app/media/utils/iconPicker/iconSearch";
import { FlagsButton, RefreshButton, SwitchPageButton } from "./buttons";
import { IconTableEditor } from "@/app/media/utils/iconPicker/iconTable";
import { Icon } from "@/app/media/utils/iconPicker/iconDefinitions";

// Utility page for viewing and resolving icon conflict/error logs
export default async function Page({ params }: { params: { tableName: string } }) {
    const table = new IconTableEditor(params.tableName);
    await table.loadTable();


    // Extract queries as keys from dictionary
    const keys = table.getUnflaggedQueries();
    keys.push('', ...table.getFlaggedQueries());

    return (
        <div className="flex flex-col p-12 gap-10">
            <div className="flex flex-row justify-between -mb-4 pr-1.5 pl-1">
                <div className="flex flex-row gap-3 -mb-4">
                    <SwitchPageButton newTableName="solo" readableName="Industries"></SwitchPageButton>
                    <SwitchPageButton newTableName="batch" readableName="Products"></SwitchPageButton>
                </div>
                <RefreshButton tableName={params.tableName}></RefreshButton>
            </div>
            {
                keys.map(function (key, index) { // FOR EACH: icon query log
                    if (key.length == 0)
                        return (<p className="text-base font-medium opacity-75  mx-auto -mb-6 mt-2" >Reviewed Entries</p>);
                    table.setKey(key);
                    var uncertainty = table.getUncertainty();

                    // Color based on issue status
                    var priorityColor: string;
                    if (uncertainty >= 1)
                        priorityColor = 'red'; // No icon provided
                    else if (uncertainty > GOOD_SCORE_CUTOFF)
                        priorityColor = 'yellow'; // Low-scoring icon provided
                    else
                        priorityColor = 'green'; // High-scoring icon provided

                    // Adjust message based on status & skipped options
                    const iconDesc = table.getEntryDetails();



                    return (
                        // Log entry card
                        <div key={key + 'card'} className={"flex flex-col text-left justify-start items-stretch relative py-2 px-3 min-h-28 border-6 border-" + priorityColor}>
                            {/* Priority super-header */}
                            <p className="absolute opacity-35 text-sm font-medium -top-6 right-0">{uncertainty?.toFixed(1)}</p>
                            {/* Resolve issue button */}
                            <div className="absolute opacity-100 font-medium bottom-3 right-3">
                                <FlagsButton iconKey={key} flag={table.getFlag()} desc={iconDesc} color={priorityColor} tableName={params.tableName}></FlagsButton>
                            </div>
                            {/* Log details */}
                            <div className="flex flex-row w-full">
                                {/* Title */}
                                <h1 className="text-xl font-medium opacity-85">{iconDesc.summary}</h1>
                                {/* Query */}
                                <h1 className="text-xl font-medium opacity-100 pl-2">{'\' ' + key + ' \''}</h1>
                                {/* <h1 className="text-xl font-medium  ml-2.5 opacity-25">{'('+pageName+')'}</h1> */}

                                {/* Score of resolved icon */}
                                <h1 className="text-xl font-medium ml-auto opacity-25">{table.getScore()?.toFixed(3)}</h1>
                                {/* <ScoreIcon className="opacity-100" score={missingIcons[key].fallbackScore}/> */}
                            </div>

                            {/* Icon stack */}
                            <div className="flex flex-row overflow-hidden flex-wrap w-full h-20 p-2 mb-2 pr-24">
                                <div className="">
                                    {table.hasIcon() ? (<IconWidget icon={table.getIcon()} score={table.getScore()} original={key} />) : ''}
                                </div>
                                <p className="font-medium text-3xl mx-6 mt-3 opacity-40">⇥</p>
                                {table.getSkips()?.map((overlapIcon, index) => { // FOR EACH: Found but unused icon
                                    return (
                                        <div key={overlapIcon.icon?.name + key + index} className="mr-3">
                                            <IconWidget icon={overlapIcon.icon} score={overlapIcon.score} query={overlapIcon.winningQuery} />
                                        </div>
                                    );
                                })}
                            </div>

                        </div>)
                })
            }
        </div>
    );
}

// COMPONENT: Icon + score
function IconWidget({ icon, score, query, original }: { icon?: Icon, score?: number, query?: string, original?: string }) {
    let message = '';
    if (!query) {
        if (!original)
            message = 'Rejected';
        else
            message = original;
    }
    else {
        if (query == 'Unused')
            message = '';
        else
            message = 'Used for ' + query;
    }

    return (
        <div className="flex flex-col items-start">
            <p className="text-sm font-medium h-5 opacity-60">{message}</p>
            <div className="flex flex-row">
                <svg className={query ? '' : ''} xmlns="http://www.w3.org/2000/svg" height='48' width='48' viewBox={icon?.viewbox ? icon.viewbox : "0 -960 960 960"}><path d={icon?.path} fill="#07090F" /></svg>
                <div className='p-1 pl-1.5'>
                    <p className="text-xs">{'\'' + icon?.name + '\''}</p>
                    <div className="flex flex-row gap-0.5 mt-1">
                        <ScoreIcon className="opacity-100" score={score} />
                        <p className="text-xs opacity-60 pl-px">{score?.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

// COMPONENT: Small visual indicator of a score's confidence
function ScoreIcon({ className, score }: { className: string, score?: number }) {
    if (!score) return '';
    var color = 'green';
    if (score > BAD_SCORE_CUTOFF)
        color = 'red';

    return (<div className={className + ' ml-0.5 mt-px w-4 h-3 border-2 border-' + color + ' relative'}>
        <div style={{ width: ((1 - score) * 100) + '%' }} className={"bg-" + color + " absolute left-0 top-0 bottom-0"}>

        </div>
    </div>);

}