import fetch from "node-fetch";
import { parse } from 'node-html-parser';
import { PersonRole } from "./structure";
import { writeFileSync } from "fs";
const colors = require('colors');

const getWikipediaSections = async (title: string) => {
    try {

        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${title}&prop=sections`);
        // console.log(await response.text());
        
        // for some reason, response.json() throws an error for some songs
        const text = await response.text();
        
        // console.log("\n" + text);
        const json = JSON.parse(text);
        
        
        // return text;
        return json;
    } catch (e) {
        console.log("hello world!");
    }
}

const getWikipediaSectionByName = async (title: string, sectionName: string) => {
    let page = (await getWikipediaSections(title)).parse;
    // console.log(page.sections);

    let sectionIndex = parseInt(page.sections.find((section: any) => section.line.includes(sectionName)).index);

    let personnelSection = (await getWikipediaSection(title, sectionIndex));
    return personnelSection
}

const getWikipediaSection = async (title: string, section: number) => {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${title}&section=${section.toString()}&prop=text`);
    const text = await response.text();

    const json = JSON.parse(text);

    return json;
}

const getSongPersonnelData = async (pageId: string) => {
    let personnelSection = (await getWikipediaSectionByName(pageId, "Personnel")).parse;
    let root = parse(personnelSection.text["*"]);
    let personnelLines = root.querySelector("ul").innerText.split("\n");

    writeFileSync("./personnel_html/" + pageId + ".html", personnelSection.text["*"]);

    let personnel: PersonRole[] = personnelLines.map(line => {
        let [name, rolesRaw] = line.split("–");
        if (line.includes("&#8211;")) {
            [name, rolesRaw] = line.split("&#8211;");
        }

        // replace " and " with "," then split on "," and trim each role
        if (typeof rolesRaw === "undefined") {
            console.log(colors.red('Couldn\'t find roles in ' + pageId));
        }
        // console.log(line);

        let roles = rolesRaw.split(" and ").join(",").split(",").map(a => removeExtraneousCharacters(a).trim());
        return { name: name.trim(), roles };
    });

    return personnel;
}

const removeExtraneousCharacters = (text: string) => {
    // on wikipedia, to reference a citation, a fact is stated with [citation number] afterwards (in square brackets). This function removes that.
    let regex = /&#91;.*?&#93;/g;

    let result = text.replace(regex, "");
    return result;
}

export {
    getWikipediaSections,
    getWikipediaSection,
    getSongPersonnelData,
    getWikipediaSectionByName
}