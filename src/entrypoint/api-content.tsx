import {info} from "../utils/Logger";
import {queryInContainer} from "../scraping/api-scraper";

info("Api-Content has started!")

queryInContainer("https://api-reader.tinkercad.com/users").then((v) => {
    console.log(v)
})