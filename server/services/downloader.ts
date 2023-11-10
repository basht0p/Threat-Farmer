import { dataDb } from "./mongo";
import axios from "axios";
interface FeedType {
    type: "csv" | "txt" | "json";
}

export async function DownloadFeedContent(url: string, FeedType: FeedType, RequestingFeed: string){
    const response = await axios.get(url)

    switch (FeedType.type) {
        case "csv":
            console.log(typeof response.data)
            break;
        case "txt":
            console.log(response)
            break;
        case "json":
            let FeedData: Array<object> = response.data;
            console.log(Object.keys(FeedData).length)
            FeedData.map((entry) => {
                dataDb.collection(RequestingFeed).insertOne(entry)
            })
            break;  
        default:
            break;
    }
}
