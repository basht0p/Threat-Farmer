import { Feed, getAllFeeds, getFeed, deleteFeed, updateFeed, toggleFeed } from "./classes/feed";
import bodyParser from "body-parser";
import { v4 } from 'uuid';
import cors from "cors";
import express from "express";
import { emitUpdatedFeeds } from "./socket";

// Define backend ports
const expressPort: number = 8123;

// Instantiate Express

export const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Routes

app.get("/ws/feeds", async (req, res) => {
    emitUpdatedFeeds();
    res.sendStatus(200)
})

app.get("/api/getFeed", async (req, res) => {

    if(req.query.id === undefined){
        res.send("Error! No id specified")
    } else {
        var id = (req.query.id).toString();
        const r = await getFeed(id);

        if (r !== null) {
            const feedResult = new Feed({
                id: `${r._id}`,
                name: `${r.name}`,
                url: `${r.url}`,
                format: `${r.format}`,
                observables: r.observables,
                key: `${r.key}`,
                state: r.state,
                comments: r.comments,
                headers: r.headers,
                purge: r.purge,
                frequency: `${r.frequency}`,
                map: r.map
            })

            res.send(feedResult)
        } else {
            res.send("No feed found with the given id.");
        }
    }
});

app.get("/api/deleteFeed", async (req, res) => {

    if(req.query.id === undefined){

        res.send("Error! No id specified")

    } else {

        // Delete the requested feed
        var id = (req.query.id).toString();
        const deleteResult = deleteFeed(id);

        if (deleteResult !== null) {

            // Send out the updated feed list
            emitUpdatedFeeds();
            res.sendStatus(200)

        } else {

            res.send("No feed found with the given id.");

        }
    }
});

app.post("/api/createFeed", async (req, res) => {
    const formData = req.body;

    const newFeed = new Feed({
        name: formData.name,
        id: v4(),
        url: formData.url,
        format: formData.format,
        observables: formData.observables,
        key: formData.key,
        state: formData.state,
        comments: formData.comments,
        headers: formData.headers,
        purge: formData.purge,
        frequency: formData.frequency,
        map: formData.map
    })
    
    // Write the new feed to the database
    await newFeed.save();

    // Emit the new list of feeds to all websocket clients
    emitUpdatedFeeds();

    res.sendStatus(200)
});

app.post("/api/updateFeed", async (req, res) => {

    const formData = req.body;
    const newFeed = new Feed({
        name: formData.name,
        id: formData.id,
        url: formData.url,
        format: formData.format,
        observables: formData.observables,
        key: formData.key,
        state: formData.state,
        comments: formData.comments,
        headers: formData.headers,
        purge: formData.purge,
        frequency: formData.frequency,
        map: formData.map
    })
    
    await updateFeed(newFeed.id, newFeed);

    emitUpdatedFeeds();
    res.sendStatus(200)
});

app.get("/api/toggleFeed", async (req, res) => {
    if(req.query.id === undefined){
        console.log("Got a request to toggle a feed")
        res.send("Error! No id specified")
    } else {
        console.log("Got a request to toggle a feed")
        var id = (req.query.id).toString();

        toggleFeed(id).then(() => {
            emitUpdatedFeeds();
            res.sendStatus(200)
        }).catch(error => {
            console.log(error)
            res.sendStatus(500)
        });
    }
});

app.listen(expressPort);