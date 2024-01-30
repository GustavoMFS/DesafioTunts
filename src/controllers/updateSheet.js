import { processSpreadsheet } from './SpreadsheetController.js';

async function updateSheet() {
    await processSpreadsheet();
}

updateSheet();