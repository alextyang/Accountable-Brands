"use server";

import { IconTableEditor } from "./iconTable";


// SERVER ACTION: Ignore a given icon error/conflict
export async function rejectChoice(tableName: string, key: string) {
    console.log('[Admin Action] Rejecting choice ' + tableName + ' - ' + key + ' to ignore.');

    const table = new IconTableEditor();
    await table.loadIconTable(tableName);
    table.setKey(key);


    if (!table.hasEntry())
        return key;


    table.removeIcon();

    if (table.getUncertainty() > 0)
        table.setUncertainty(0);
    else
        table.setUncertainty(2);

    await table.saveIconTable(tableName);

    console.log(table.table);
    return key;
}

// SERVER ACTION: Ignore a given icon error/conflict
export async function confirmChoice(tableName: string, key: string) {
    console.log('[Admin Action] Confirming ' + tableName + ' - ' + key + ' to ignore.')

    const table = new IconTableEditor();
    await table.loadIconTable(tableName);
    table.setKey(key);

    if (!table.hasEntry())
        return key;

    while (table.getUncertainty() > -1)
        table.addUncertainty(-1);

    await table.saveIconTable(tableName);
    return key;
}