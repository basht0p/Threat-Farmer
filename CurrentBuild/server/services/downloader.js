"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadFeedContent = void 0;
const mongo_1 = require("./mongo");
const axios_1 = __importDefault(require("axios"));
const sync_1 = require("csv-parse/sync");
function DownloadFeedContent(feedConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(feedConfig.url);
        let FeedData;
        switch (feedConfig.format) {
            case "csv":
                // Split the response data by newline and filter out comment lines
                const filteredData = response.data
                    .split('\n') // Split the data into lines
                    .filter((line) => !line.includes('#')) // Filter out lines containing '#'
                    .join('\n') // Join the remaining lines back together
                    .trim(); // Trim trailing newlines
                FeedData = (0, sync_1.parse)(filteredData, {
                    columns: true,
                    skip_empty_lines: true,
                    quote: '"'
                });
                break;
            case "txt":
                // Assuming feedConfig.key is a string that represents the key you want to use
                const keyName = feedConfig.key;
                FeedData = response.data
                    .split('\n') // Split by newline to get individual lines
                    .filter((line) => line.trim().length > 0 && !line.trim().startsWith('#')) // Filter out comments and empty lines
                    .map((line) => ({ [keyName]: line.trim() })); // Create an object for each line with the specified key
                break;
            case "json":
                FeedData = response.data;
                break;
            default:
                return;
        }
        if (feedConfig.purge) {
            yield mongo_1.dataDb.dropCollection(feedConfig.id);
            yield mongo_1.dataDb.createCollection(feedConfig.id);
        }
        for (const entry of FeedData) {
            if (entry.hasOwnProperty(feedConfig.key)) {
                yield mongo_1.dataDb.collection(feedConfig._id).updateMany({ key: entry[feedConfig.key] }, { $set: entry }, { upsert: true });
            }
            else {
                console.error(`Key '${feedConfig.key}' not found in entry.`);
            }
        }
    });
}
exports.DownloadFeedContent = DownloadFeedContent;
//# sourceMappingURL=downloader.js.map