// Import the necessary modules
import * as Agenda from 'agenda';
import { DownloadFeedContent } from './downloader';
import { FeedDb, FeedDocument } from './mongo';


const FrequencyMap: Record<string,string> = {
    "1": "30 seconds",
    "2": "30 minutes",
    "3": "1 hour",
    "4": "4 hours",
    "5": "12 hours",
    "6": "1 day"
}

// Initialize Agenda
const mongoConnectionString = 'mongodb://127.0.0.1:27017/threatconfig';
const agenda = new Agenda.Agenda({ db: { address: mongoConnectionString, collection: 'jobs' }});

// Define a function to schedule download jobs
const scheduleDownloadJob = async (feed: FeedDocument) => {
    const jobName = `download feed ${feed._id}`;
    console.log(`Scheduling job: ${jobName}`);

    agenda.define(jobName, async (job: Agenda.Job) => {
        console.log(`Downloading data for feed ID: ${feed._id}`);
        const refreshedFeed = await FeedDb.findOne({ _id: feed._id });
        if (refreshedFeed) {
            await DownloadFeedContent(refreshedFeed);
        }
    });

    await agenda.every(FrequencyMap[feed.frequency], jobName, { feed });
};

// Initialize and start Agenda
export const startAgenda = async () => {
    try {
        await agenda.start();
        console.log("Agenda started successfully.");

        // Load existing feeds and schedule jobs
        const existingFeeds = await FeedDb.find({});
        for (const feed of existingFeeds) {
            await scheduleDownloadJob(feed);
        }
    
    } catch (error) {
        console.error("Error starting Agenda:", error);
        return;
    }
    
    // Set up listeners for feed changes
    FeedDb.watch().on('change', async (change) => {
        console.log("Feed change detected");
    
        const feedId = change.documentKey._id;
    
        if (change.operationType === 'insert' || (change.operationType === 'update')) {
            const feed = await FeedDb.findById(feedId);
            if (feed) {
                await scheduleDownloadJob(feed);
            }
        } else if (change.operationType === 'delete') {
            const jobName = `download feed ${feedId}`;
            await agenda.cancel({ name: jobName });
            console.log(`Canceled job for feed ID: ${feedId}`);
        }
    });
    
};
