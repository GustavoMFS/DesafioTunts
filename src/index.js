import { processSpreadsheet } from './controllers/SpreadsheetController.js';

async function updateSheet() {
    await processSpreadsheet();
}

updateSheet();