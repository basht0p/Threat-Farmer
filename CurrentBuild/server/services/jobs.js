"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAgenda = void 0;
// Import the necessary modules
const Agenda = __importStar(require("agenda"));
const downloader_1 = require("./downloader");
const mongo_1 = require("./mongo");
const FrequencyMap = {
    "1": "30 seconds",
    "2": "30 minutes",
    "3": "1 hour",
    "4": "4 hours",
    "5": "12 hours",
    "6": "1 day"
};
// Initialize Agenda
const mongoConnectionString = 'mongodb://127.0.0.1:27017/threatconfig';
const agenda = new Agenda.Agenda({ db: { address: mongoConnectionString, collection: 'jobs' } });
// Define a function to schedule download jobs
const scheduleDownloadJob = (feed) => __awaiter(void 0, void 0, void 0, function* () {
    const jobName = `download feed ${feed._id}`;
    console.log(`Scheduling job: ${jobName}`);
    console.log;
    agenda.define(jobName, (job) => __awaiter(void 0, void 0, void 0, function* () {
        const refreshedFeed = yield mongo_1.FeedDb.findOne({ _id: feed._id });
        if (refreshedFeed) {
            if (refreshedFeed.state) {
                yield (0, downloader_1.DownloadFeedContent)(refreshedFeed);
                console.log(`Executing job for feed: ${feed.name} (${feed._id})`);
            }
            else {
                console.log(`Job for ${feed.name} (${feed._id}) not executed. Feed is disabled.`);
            }
        }
    }));
    yield agenda.every(FrequencyMap[feed.frequency], jobName, { feed });
});
// Initialize and start Agenda
const startAgenda = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield agenda.start();
        console.log("Agenda started successfully.");
        // Load existing feeds and schedule jobs
        const existingFeeds = yield mongo_1.FeedDb.find({});
        for (const feed of existingFeeds) {
            yield scheduleDownloadJob(feed);
        }
    }
    catch (error) {
        console.error("Error starting Agenda:", error);
        return;
    }
    // Set up listeners for feed changes
    mongo_1.FeedDb.watch().on('change', (change) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Feed change detected");
        const feedId = change.documentKey._id;
        if (change.operationType === 'insert' || (change.operationType === 'update')) {
            const feed = yield mongo_1.FeedDb.findById(feedId);
            if (feed) {
                yield scheduleDownloadJob(feed);
            }
        }
        else if (change.operationType === 'delete') {
            const jobName = `download feed ${feedId}`;
            yield agenda.cancel({ name: jobName });
            console.log(`Canceled job for feed ID: ${feedId}`);
        }
    }));
});
exports.startAgenda = startAgenda;
//# sourceMappingURL=jobs.js.map