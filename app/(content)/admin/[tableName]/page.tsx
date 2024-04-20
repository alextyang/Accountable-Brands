"use server";

import { BAD_SCORE_CUTOFF } from "@/app/lib/utils/iconPicker/iconSearch";
import { ConfirmButton, RejectButton } from "./buttons";
import { IconTableEditor } from "@/app/lib/utils/iconPicker/iconTable";

// Utility page for viewing and resolving icon conflict/error logs
export default async function Page({ params }: { params: { tableName: string } }) {
    const table = new IconTableEditor();
    await table.loadIconTable(params.tableName);


    // Extract queries as keys from dictionary
    const keys = table.getQueries();

    return (
        <div className="flex flex-col p-12 gap-10">
            {
                keys.map(function (key, index) { // FOR EACH: icon query log
                    table.setKey(key);
                    var uncertainty = table.getUncertainty();

                    // Color based on issue status
                    var priorityColor: string;
                    if (uncertainty >= 1)
                        priorityColor = 'border-red'; // No icon provided
                    else if (uncertainty > 0)
                        priorityColor = 'border-yellow'; // Low-scoring icon provided
                    else
                        priorityColor = 'border-green'; // High-scoring icon provided

                    // Adjust message based on status & skipped options
                    const { summary, confirm, reject } = table.getEntryDetails();



                    return (
                        // Log entry card
                        <div key={key} className={"flex flex-col text-left justify-start items-stretch relative py-2 px-3 min-h-28 border-6 " + priorityColor}>
                            {/* Priority super-header */}
                            <p className="absolute opacity-35 text-sm font-medium -top-6 right-0">{uncertainty.toFixed(1)}</p>
                            {/* Resolve issue button */}
                            <div className="absolute opacity-100 font-medium bottom-2 right-2 flex flex-col gap-1 items-end">
                                <ConfirmButton message={confirm} iconKey={key} tableName={params.tableName} />
                                <RejectButton message={reject} iconKey={key} tableName={params.tableName} />
                            </div>
                            {/* Log details */}
                            <div className="flex flex-row w-full">
                                {/* Title */}
                                <h1 className="text-xl font-medium opacity-85">{summary}</h1>
                                {/* Query */}
                                <h1 className="text-xl font-medium opacity-100 pl-2">{'\' ' + key + ' \''}</h1>
                                {/* <h1 className="text-xl font-medium  ml-2.5 opacity-25">{'('+pageName+')'}</h1> */}

                                {/* Score of resolved icon */}
                                <h1 className="text-xl font-medium ml-auto opacity-25">{table.getScore()?.toFixed(3)}</h1>
                                {/* <ScoreIcon className="opacity-100" score={missingIcons[key].fallbackScore}/> */}
                            </div>

                            {/* Icon stack */}
                            <div className="flex flex-row overflow-hidden flex-wrap w-full h-20 p-2 mb-2">
                                <div className="">
                                    {table.hasIcon() ? (<IconWidget name={table.getIcon()?.name} score={table.getScore()} path={table.getIcon()?.path} original={key} />) : ''}
                                </div>
                                <p className="font-medium text-3xl mx-6 mt-3 opacity-40">⇥</p>
                                {table.getSkips().map((overlapIcon) => { // FOR EACH: Found but unused icon
                                    return (
                                        <div key={overlapIcon.icon?.name} className="mr-3">
                                            <IconWidget name={overlapIcon.icon?.name} score={overlapIcon.score} path={overlapIcon.icon?.path} query={overlapIcon.winningQuery} original='' />
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
function IconWidget({ name, path, score, query, original }: { name?: string, path?: string, score?: number, query?: string, original: string }) {
    return (
        <div className="flex flex-col items-start">
            <p className="text-sm font-medium h-5 opacity-60">{query ? 'Already used \'' + query + '\'' : original}</p>
            <div className="flex flex-row">
                <svg className={query ? '' : ''} xmlns="http://www.w3.org/2000/svg" height='48' width='48' viewBox="0 -960 960 960"><path d={path} fill="#07090F" /></svg>
                <div className='p-1 pl-1.5'>
                    <p className="text-xs">{'\'' + name + '\''}</p>
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