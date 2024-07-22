import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';
import { config } from "dotenv";
import fs from "fs";
config();

const serviceAccountAuth = new JWT({
    // env var values here are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREED_SHEET, serviceAccountAuth);

await doc.loadInfo(); // loads document properties and worksheets
const sheet = doc.sheetsByIndex[0];
const AsuSheet = doc.sheetsByIndex[1];

let rows = await sheet.getRows();
let Asurows = await AsuSheet.getRows();
let HOCON_DATA = "marker-sets: {\n\tCities-markers: {\n\t\tlabel:\"Städer\"\n\t\ttoggleable: true\n\t\tdefault-hidden: false\n\t\tsorting: 0\n\n\tmarkers:{\n\t\t\t<citys>}}\n\tCities-markers: {\n\t\tlabel:\"Asufaruto\"\n\t\ttoggleable: true\n\t\tdefault-hidden: false\n\t\tsorting: 0\n\n\tmarkers:{\n\t\t\t<Asufaruto>}}}";
let HOCON_CITY_DATA = "<name>:{\n\t\t\t\ttype:\"poi\"\n\t\t\t\tposition:{x: <X>, y: <Y>, z: <Z>}\n\t\t\t\tlabel: \"<name>\"\n\t\t\t\tdetail: \"<p style='width: 200px;'><b><NAMN></b> är en <TYP> på 90gQ Trusted. Staden grundades <DATUM> av <GRUNDARE>. Staden ägs av <ÄGARE>, och styrs som en <STYRE>. Kod: <KOD>, Postnummer: <POSTNR>. <a style='pointer-events: all;' href='https://trusted.fandom.com/sv/wiki/<NAMN>' target='_blank'>Läs mer på wikin...</a></p>\"\n\t\t\t\ticon: \"assets/CitySymbol.png\"\n\t\t\t\tanchor: { x: 25, y: 45 }\n\t\t\t\tsorting: 0\n\t\t\t\tlisted: true\n\t\t\t\tmin-distance: 10\n\t\t\t\tmax-distance: 10000000}\n\t\t\t";
let HOCON_CITY_ASUFARUTO = "<name>:{\n\t\t\t\ttype:\"poi\"\n\t\t\t\tposition:{x: <X>, y: <Y>, z: <Z>}\n\t\t\t\tlabel: \"<GATA> <NR>, <POSTNR> <REGION>\"\n\t\t\t\tdetail: \"<p style='width: 200px;'><b><GATA> <NR>, <POSTNR> <REGION></b> ägs av <ÄGARE>. På adressen finns <TITEL>\"\n\t\t\t\ticon: \"assets/HouseSymbol.png\"\n\t\t\t\tanchor: { x: 25, y: 45 }\n\t\t\t\tsorting: 0\n\t\t\t\tlisted: true\n\t\t\t\tmin-distance: 10\n\t\t\t\tmax-distance: 10000000}\n\t\t\t";
let all_hcon_city_data = "";
let all_hcon_asu_data = "";
for (let i = 0; i < rows.length; i++) {
    let copy_city_data = HOCON_CITY_DATA;
    copy_city_data = copy_city_data.replace("<name>", rows[i].get("Namn"));
    copy_city_data = copy_city_data.replace("<name>", rows[i].get("Namn"));
    copy_city_data = copy_city_data.replace("<NAMN>", rows[i].get("Namn"));
    copy_city_data = copy_city_data.replace("<NAMN>", rows[i].get("Namn"));
    copy_city_data = copy_city_data.replace("<X>", rows[i].get("X") || "0");
    copy_city_data = copy_city_data.replace("<Y>", 64);
    copy_city_data = copy_city_data.replace("<Z>", rows[i].get("Z") || "0");
    copy_city_data = copy_city_data.replace("<TYP>", rows[i].get("Typ") || "OKÄND");
    copy_city_data = copy_city_data.replace("<DATUM>", rows[i].get("Datum") || "OKÄND");
    copy_city_data = copy_city_data.replace("<GRUNDARE>", rows[i].get("Grundare") || "OKÄND");
    copy_city_data = copy_city_data.replace("<ÄGARE>", rows[i].get("Ägare") || "OKÄND");
    copy_city_data = copy_city_data.replace("<STYRE>", rows[i].get("Styre") || "OKÄND");
    copy_city_data = copy_city_data.replace("<KOD>", rows[i].get("Kod") || "OKÄND");
    copy_city_data = copy_city_data.replace("<POSTNR>", rows[i].get("Postnr") || "OKÄND");
    all_hcon_city_data += copy_city_data;
}
for (let i = 0; i < Asurows.length; i++) {
    let copy_aus_data = HOCON_CITY_ASUFARUTO;
    copy_aus_data = copy_aus_data.replace("<name>", Asurows[i].get("Stad"));
    copy_aus_data = copy_aus_data.replace("<X>", Asurows[i].get("X") || "0");
    copy_aus_data = copy_aus_data.replace("<Y>", 64);
    copy_aus_data = copy_aus_data.replace("<Z>", Asurows[i].get("Z") || "0");
    copy_aus_data = copy_aus_data.replace("<GATA>", Asurows[i].get("Gata") || "OKÄND");
    copy_aus_data = copy_aus_data.replace("<NR>", Asurows[i].get("Nr") || "OKÄND");
    copy_aus_data = copy_aus_data.replace("<POSTNR>", Asurows[i].get("Postnr") || "OKÄND");
    copy_aus_data = copy_aus_data.replace("<REGION>", Asurows[i].get("Region") || "OKÄND");
    copy_aus_data = copy_aus_data.replace("<GATA>", Asurows[i].get("Gata") || "OKÄND");
    copy_aus_data = copy_aus_data.replace("<NR>", Asurows[i].get("Nr") || "OKÄND");
    copy_aus_data = copy_aus_data.replace("<POSTNR>", Asurows[i].get("Postnr") || "OKÄND");
    copy_aus_data = copy_aus_data.replace("<REGION>", Asurows[i].get("Region") || "OKÄND");
    copy_aus_data = copy_aus_data.replace("<ÄGARE>", Asurows[i].get("Ägare") || "OKÄND");
    copy_aus_data = copy_aus_data.replace("<TITEL>", Asurows[i].get("Ägare") || "Titel");
    all_hcon_asu_data += copy_city_data;
}

HOCON_DATA = HOCON_DATA.replace("<citys>", all_hcon_city_data);
HOCON_DATA = HOCON_DATA.replace("<Asufaruto>", all_hcon_asu_data);

fs.writeFileSync("cities.txt", HOCON_DATA);
