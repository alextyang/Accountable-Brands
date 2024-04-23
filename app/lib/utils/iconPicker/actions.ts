"use server";

import { Icon, IconFlag } from "./iconDefinitions";
import { IconTableEditor, tryTableSave } from "./iconTable";

// SERVER ACTION: Ignore a given icon error/conflict
export async function refreshTable(tableName: string) {

    await tryTableSave(tableName);

    return tableName;
}

// SERVER ACTION: Ignore a given icon error/conflict
export async function setFlag(tableName: string, key: string, flag: IconFlag, newIcon?: Icon) {
    console.log('[Admin] Flagging ' + key + ' - ' + tableName + ' to ' + flag);

    const table = new IconTableEditor(tableName);
    await table.loadTable();
    table.setKey(key);

    if (!table.hasEntry())
        return key;

    if (flag == 'none') {
        const oldflag = table.getFlag();
        if (oldflag == "approved")
            table.addUncertainty(2);
        else if (oldflag == 'removed') {
            table.clearBlacklist();
            table.setUncertainty(1);
        }
        else if (oldflag == 'skipped') {
            table.clearBlacklist();
            table.setUncertainty(2);
        }
    }
    else if (flag == 'approved')
        while (table.getUncertainty() > -1)
            table.addUncertainty(-1);
    else if (flag == 'removed') {
        table.removeIcon();
        table.setUncertainty(2);
    }
    else if (flag == 'replaced' && newIcon) {
        table.setIcon(newIcon);
    }
    else if (flag == 'skipped') {
        table.removeIcon();
        table.setUncertainty(0);
    }


    table.setFlag(flag);
    await table.saveTable();
    await tryTableSave(tableName);

    return key;
}