"use server";

import { LOW_SCORE_CUTOFF, missingIcons, saveMissingIconData } from "@/app/lib/icons/dynamicIcons";
import { IgnoreButton } from "./iconMenu";

export default async function Page() {
    const keysArray = Object.keys(missingIcons).sort(function(first,second) {
        return (missingIcons[second].priority - missingIcons[second].ignoreScore) - (missingIcons[first].priority - missingIcons[first].ignoreScore);
    });

    return (<div className="flex flex-col p-12 gap-10">
        {
            keysArray.map(function(key, index) {

                var priority = missingIcons[key].priority;
                if (missingIcons[key].priority <= missingIcons[key].ignoreScore)
                    priority = 0;

                var priorityColor:string;
                if (priority >= 1)
                    priorityColor = 'border-red';
                else if (priority > 0) 
                    priorityColor = 'border-yellow';
                else
                    priorityColor = 'border-green';

                var header:string;
                var message:string;
                if (missingIcons[key].fallbackName && priority == 0)
                    [header, message] = ['Found suitable icon for ', ''];
                else if (!missingIcons[key].fallbackName && priority == 0)
                    [header, message] = ['Skipped redundant ', ''];
                else if (!missingIcons[key].fallbackName && missingIcons[key].overlaps.length > 0)
                    [header, message] = ['Couldn\'t find a unique icon for ', 'Mark as redundant'];
                else if (!missingIcons[key].fallbackName && missingIcons[key].overlaps.length == 0)
                    [header, message] = ['Couldn\'t find any icon for ', 'Mark as unnecessary'];
                else if (missingIcons[key].fallbackName && missingIcons[key].overlaps.length == 0)
                    [header, message] = ['Low-scoring icon used for ', 'Mark as suitable'];
                else if (missingIcons[key].fallbackName && missingIcons[key].overlaps.length > 0)
                    [header, message] = ['Resorted to fallback for ', 'Mark as suitable'];
                else 
                    [header, message] = ['Error with ', ''];

                    

                return (
                <div key={key} className={"flex flex-col text-left justify-start items-stretch relative py-2 px-3 min-h-28 border-6 "+priorityColor}>
                    <p className="absolute opacity-35 text-sm font-medium -top-6 right-0">{priority}</p>
                    <div className="absolute opacity-100 font-medium bottom-2 right-2"><IgnoreButton message={message} iconKey={key}/></div>
                    <div className="flex flex-row w-full">
                        <h1 className="text-xl font-medium opacity-85">{header}</h1>
                        <h1 className="text-xl font-medium opacity-100 pl-2">{'\' '+key+' \''}</h1>
                        {/* <h1 className="text-xl font-medium  ml-2.5 opacity-25">{'('+pageName+')'}</h1> */}

                        <h1 className="text-xl font-medium ml-auto opacity-25">{missingIcons[key].fallbackScore}</h1>
                        {/* <ScoreIcon className="opacity-100" score={missingIcons[key].fallbackScore}/> */}
                    </div>
                    <div className="flex flex-row w-full p-2">
                        <div className="">
                            {missingIcons[key].fallbackName ? (<IconWidget name={missingIcons[key].fallbackName} score={missingIcons[key].fallbackScore} path={missingIcons[key].fallbackPath} original={key} />) : ''}
                        </div>
                        <p className="font-medium text-3xl mx-6 mt-3 opacity-40">⇥</p>
                        {missingIcons[key].overlaps.map((overlapIcon) => {
                            return (
                                <div key={overlapIcon.overlapName}>
                                    <IconWidget name={overlapIcon.overlapName} score={overlapIcon.overlapScore} path={overlapIcon.overlapPath} query={overlapIcon.overlapQuery} original='' />
                                </div>
                            );
                        })}
                    </div>
                    
                </div> )
            })
        }
    </div>);
}

function IconWidget({name, path, score, query, original}:{name?:string,path?:string,score?:number,query?:string, original:string}) {
    return (
        <div className="flex flex-col items-center">
            <p className="text-sm font-medium h-5 opacity-60">{query ? 'Already used \''+query+'\'' : original}</p>
            <div className="flex flex-row">
                <svg className={query ? 'opacity-75' : ''} xmlns="http://www.w3.org/2000/svg" height='48' width='48' viewBox="0 -960 960 960"><path d={path} fill="#07090F"/></svg>
                <div className='p-1 pl-1.5'>
                    <p className="text-xs">{'\''+name+'\''}</p>
                    <div className="flex flex-row gap-0.5 mt-1">
                        <ScoreIcon className="opacity-100" score={score}/>
                        <p className="text-xs opacity-60 pl-px">{score}</p>
                    </div>
                </div>
            </div>
        </div>
       
    )
}

function ScoreIcon({className,score}:{className:string,score?:number}) {
    if (!score) return '';
    var color = 'green';
    if (score > LOW_SCORE_CUTOFF)
        color = 'red';

    return (<div className={className+' ml-0.5 mt-px w-4 h-3 border-2 border-'+color+' relative'}>
        <div style={{width:((1-score)*100)+'%'}} className={"bg-"+color+" absolute left-0 top-0 bottom-0"}>

        </div>
    </div>);

}