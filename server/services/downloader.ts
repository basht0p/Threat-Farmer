import { JobAttributesData } from "agenda";
import { FeedDocument, dataDb } from "./mongo";
import axios from "axios";
import { parse } from 'csv-parse/sync';

export async function DownloadFeedContent(feedConfig: FeedDocument){
    const response = await axios.get(feedConfig.url);
    let FeedData: Array<object>;

    switch (feedConfig.format) {
        case "csv":
            // Split the response data by newline and filter out comment lines
            const filteredData = response.data
                .split('\n') // Split the data into lines
                .filter((line: string) => !line.includes('#')) // Filter out lines containing '#'
                .join('\n') // Join the remaining lines back together
                .trim(); // Trim trailing newlines

            FeedData = parse(filteredData, {
                columns: true,
                skip_empty_lines: true,
            });
            break;
        case "txt":
            // Assuming feedConfig.key is a string that represents the key you want to use
            const keyName = feedConfig.key;

            FeedData = response.data
                .split('\n') // Split by newline to get individual lines
                .filter((line: string) => line.trim().length > 0 && !line.trim().startsWith('#')) // Filter out comments and empty lines
                .map((line: string) => ({ [keyName]: line.trim() })); // Create an object for each line with the specified key

            break;
        case "json":
            FeedData = response.data;
            break;
        default:
            return;
    }


    if (feedConfig.purge) {
        await dataDb.dropCollection(feedConfig.id);
        await dataDb.createCollection(feedConfig.id);
    }

    for (const entry of FeedData) {
        if (entry.hasOwnProperty(feedConfig.key)) {
            await dataDb.collection(feedConfig._id).updateMany(
                { key: entry[feedConfig.key as keyof typeof entry] },
                { $set: entry },
                { upsert: true }
            );
        } else {
            console.error(`Key '${feedConfig.key}' not found in entry.`);
        }
    }
}
