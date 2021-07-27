import {getSongPersonnelData, getWikipediaSection} from "../src/data"

(async () => {
    let data = await getSongPersonnelData("Get Back");
    console.log(data);
    
})();