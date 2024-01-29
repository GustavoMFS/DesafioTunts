import { google } from "googleapis";
import { getAuthSheets } from "../controllers/auth.js";

// Function to calculate the situation and final grade
function calculateSituationAndFinalGrade(grades, attendance, totalClassesCell) {
    const average = (grades.P1 + grades.P2 + grades.P3) / 3;

    let situation, finalGrade;

    if (typeof totalClassesCell === 'string') {
        const totalClassesMatch = totalClassesCell.match(/(\d+)/);

        if (totalClassesMatch && totalClassesMatch.length > 1) {
            const totalClasses = parseInt(totalClassesMatch[1], 10);

            if (!isNaN(totalClasses)) {
                if (attendance > totalClasses * 0.25) {
                    situation = "Reprovado por Falta";
                    finalGrade = 0;
                } else {
                    if (average < 5) {
                        situation = "Reprovado por Nota";
                        finalGrade = 0;
                    } else if (average < 7) {
                        situation = "Exame Final";
                        finalGrade = calculateFinalGrade(average);
                    } else {
                        situation = "Aprovado";
                        finalGrade = 0;
                    }
                }

                return {
                    situation,
                    finalGrade: situation === "Exame Final" ? Math.ceil(finalGrade) : 0,
                };
            }
        }
    }

    console.error("Error: Could not extract the total number of classes from the provided cell.");
    return {
        situation: "Error",
        finalGrade: 0,
    };
}

// Function to calculate the final grade
function calculateFinalGrade(average) {
    const naf = 10 - average;
    return Math.max(5, (average + naf) / 2);
}

// Function to update the spreadsheet with calculated information
async function updateSpreadsheet(auth, spreadsheetId, data) {
    const sheets = google.sheets({ version: 'v4', auth });

    const updateData = {
        spreadsheetId,
        range: 'A2:H', // Assuming the data starts from row 2 and there's no limit to the number of rows
        valueInputOption: 'RAW',
        resource: {
            values: data,
        },
    };

    try {
        await sheets.spreadsheets.values.update(updateData);
        console.log("Spreadsheet updated successfully!");
    } catch (error) {
        console.error("Error updating the spreadsheet:", error);
    }
}

// Main function to process the spreadsheet
export async function processSpreadsheet() {
    try {
        const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

        const totalClassesResponse = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: 'A2', // Assuming the total number of classes is in cell A2
        });

        const totalClassesCell = totalClassesResponse.data.values[0][0];

        const response = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: 'A3:H', // Assuming there are no more than 1000 students, adjust as needed
        });

        const values = response.data.values;

        if (values.length) {
            for (let i = 0; i < values.length; i++) {
                const row = values[i];

                const grades = {
                    P1: parseFloat(row[3]),
                    P2: parseFloat(row[4]),
                    P3: parseFloat(row[5]),
                };

                const attendance = parseFloat(row[2]);

                const { situation, finalGrade } = calculateSituationAndFinalGrade(grades, attendance, totalClassesCell);

                row[6] = situation;
                row[7] = finalGrade;

                console.log(`Student: ${row[1]}, Situation: ${situation}, Final Grade: ${finalGrade}`);
            }

            await updateSpreadsheet(auth, spreadsheetId, values);

            console.log("Spreadsheet updated successfully!");
        } else {
            console.log("No data found in the spreadsheet.");
        }
    } catch (error) {
        console.error("Error processing the spreadsheet:", error);
    }
}
