import { google } from "googleapis";

async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: "v4",
        auth: client,
    });

    const spreadsheetId = "1BXcYezJFnO70l8eXIpbbff0Qq8PYDRnikUEIUd9YTrU";

    return {
        auth,
        client,
        googleSheets,
        spreadsheetId
    };
}

export { getAuthSheets };  // Corrija esta linha

const authController = {
    getAuthSheets: getAuthSheets,
    getAuth: async (req, res) => {
        const { googleSheets, auth, spreadsheetId } = await getAuthSheets();
        res.send({ googleSheets, auth, spreadsheetId });
    }
};

export default authController;