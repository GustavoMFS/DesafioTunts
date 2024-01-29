import app from "./app.js";
import { processSpreadsheet } from "./controllers/SpreadsheetController.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // Processa a planilha quando o servidor é iniciado
    await processSpreadsheet();
});