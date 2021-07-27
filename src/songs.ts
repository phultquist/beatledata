import { parse } from 'node-html-parser';
import { getWikipediaSectionByName, getSongPersonnelData } from "./data";
import { Song, Album, SongRole, PersonRole } from './structure';
const colors = require('colors');

let albums: Album[] = [];

const generateAlbums = async () => {
    let mainSongData = (await getWikipediaSectionByName("List_of_songs_recorded_by_the_Beatles", "Main songs")).parse.text["*"];
    let root = parse(mainSongData);
    let table = root.querySelectorAll(".wikitable")[1],
        rows = table.querySelectorAll("tr");

    // removes header row
    rows.shift();

    for (var i: number = 0; i < rows.length; i++) {
        try {
            await parseRow(rows[i]);
            const delayTime = 3000; // ms
            let currentTime = Date.now();
            while (Date.now() - currentTime < delayTime) {
                // do nothing
            }
        } catch (e) {
            console.log("Error for row " + i);
            console.log(e);
        }
    }

    // parseRow(rows[4]);
    rows.forEach(r => {
    });

    return albums;
    // console.log(rows[0].innerHTML);
}

const parseRow = async (row: any) => {
    let th = row.querySelector("th").querySelector("a").attributes;
    let songName = th["title"],
        pageId = parseHref(th["href"]);

    let cells = row.querySelectorAll("td");

    let albumData = cells[0].querySelector("a").attributes;
    // let songWriterData = cells[1].querySelectorAll("a").map((a: any) => a.attributes);

    let album = albums.find(a => a.name === albumData["title"]);
    if (!album) {
        album = new Album(albumData["title"], parseHref(albumData["href"]));
        albums.push(album);
    }

    let songPersonnel: PersonRole[] = [];

    try {
        songPersonnel = await getSongPersonnelData(pageId);
    } catch (e) {
        console.log("Error for song " + songName);
        console.log(e);
    }
    console.log(colors.green(songName + " | " +  album.name));

    album.songs.push(new Song(
        songName,
        album,
        pageId,
        songPersonnel,
    ));
    
    // console.log(album.songs[0].roles)
}

const parseHref = (href: string) => href.split("/")[2];

export {
    generateAlbums as interpretBeatleSongs
}