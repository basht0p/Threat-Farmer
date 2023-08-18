import { Feed, FeedFieldRule } from "../classes/feed";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";


dotenv.config();
const DBConnectionString: string = process.env.DB_CONN_STRING ?? 'mongodb://127.0.0.1:27017/threatconfig'

mongoose.connect(DBConnectionString);

export interface FeedFormat extends mongoose.Document {
    name: string;
    url: string;
    format: string;
    observables: Array<string>;
    key?: string;
    state: boolean;
    comments: boolean;
    headers: boolean;
    purge: boolean;
    frequency: string;
    map?: Array<FeedFieldRule>;
  }

export type FeedDocument = mongoose.Document & Feed;

export const FeedSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    format: { type: String, required: true },
    observables: { type: Array<string>, required: true },
    key: { type: String, required: false },
    state: { type: Boolean, required: true },
    comments: { type: Boolean, required: true },
    headers: { type: Boolean, required: true },
    purge: { type: Boolean, required: true },
    frequency: { type: String, required: true},
    map: { type: Array<FeedFieldRule>, required: false }
});

export const FeedDb = mongoose.model<Feed>("Feed", FeedSchema);