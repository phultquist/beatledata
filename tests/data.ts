import {getSongPersonnelData, getWikipediaSection} from "../data"

(async () => {
    let data = await getSongPersonnelData("Get Back");
    console.log(data);
    
})();