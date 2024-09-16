import nunjucks from "nunjucks";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';
import { config } from "dotenv";
import fs from "fs";
config();

(async () => {
    if(!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SPREED_SHEET) return;

    const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREED_SHEET, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    let objList = Array();

    const rows = await sheet.getRows();
    rows.forEach(row => {
        objList.push({
            id: get_id(row.get("Namn")),
            name: row.get("Namn"),
            x: parseInt(row.get("X")) || 0,
            y: 64,
            z: parseInt(row.get("Z")) || 0,
            date : row.get("Datum") || "okänt datum",
            founder: row.get("Grundare") || "okänt",
            owners : row.get("Ägare") || "okänt",
            ruleing: row.get("Styre") || "okänt",
            code: row.get("Kod") || "okänt",
            citycode: row.get("Postnr") || "okänt",
            type: row.get("Typ") || "okänt",
        });
    });

    const rendered = await nunjucks.render("trusted_overworld.njk", {cities: objList});

    fs.writeFileSync("./trusted_overworld.conf", rendered);

})();

function get_id(name: string){
    return name
        .replace(/ /g, "-")
        .replace(/å/g, "a")
        .replace(/ä/g, "a")
        .replace(/ö/g, "o")
        .replace(/ü/g, "u")
        .replace(/ô/g, "o");
}
