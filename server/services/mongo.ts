import { Feed, FeedFieldRule } from "../classes/feed";
import { Silo } from "../classes/silo";
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

// Initiate database connection
const DBConnectionString: string = process.env.DB_CONN_STRING ?? 'mongodb://127.0.0.1:27017/threatconfig'

mongoose.connect(DBConnectionString);

///////// Silo DB Configuration

export type SiloDocument = mongoose.Document & Silo;

export const SiloSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: Array<string>, required: true }
});

export const SiloDb = mongoose.model<Silo>("Silo", SiloSchema);

///////// Feed DB Configuration

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