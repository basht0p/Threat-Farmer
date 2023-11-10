import { Feed, getFeed, deleteFeed, updateFeed, toggleFeed } from "./classes/feed";
import { Silo, updateSilo, deleteSilo, toggleSilo } from "./classes/silo";
import bodyParser from "body-parser";
import { v4 } from 'uuid';
import cors from "cors";
import express from "express";
import { emitUpdatedFeeds, emitUpdatedSilos } from "./socket";
import { startAgenda } from "./services/jobs";

// Define backend ports
const expressPort: number = 8123;

// Instantiate Express and properties

export const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
startAgenda();

// Routes

    //////////////////////
   ///                ///
  ///     FEEDS      ///
 ///                ///
//////////////////////

// this route just triggers an emit() for all the feeds
app.get("/ws/feeds", async (req, res) => {
    emitUpdatedFeeds();
    res.sendStatus(200)
});

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
        const deleteResult = await deleteFeed(id);

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
        res.send("Error! No id specified")
    } else {
        var id = (req.query.id).toString();
        await toggleFeed(id)

        emitUpdatedFeeds();
        res.sendStatus(200);
    }
});

    //////////////////////
   ///                ///
  ///     SILOS      ///
 ///                ///
//////////////////////

// this route just triggers an emit() for all the silos
app.get("/ws/silos", async (req, res) => {
    emitUpdatedSilos();
    res.sendStatus(200)
});

app.get("/api/deleteSilo", async (req, res) => {

    if(req.query.id === undefined){

        res.send("Error! No id specified")

    } else {

        // Delete the requested feed
        var id = (req.query.id).toString();
        const deleteResult = await deleteSilo(id);

        if (deleteResult !== null) {

            // Send out the updated feed list
            emitUpdatedSilos();
            res.sendStatus(200)

        } else {

            res.send("No silo found with the given id.");

        }
    }
});

app.post("/api/createSilo", async (req, res) => {
    const formData = req.body;

    const newSilo = new Silo({
        name: formData.name,
        id: v4(),
        api: formData.api,
        members: formData.members,
        state: formData.state,
    })
    
    // Write the new feed to the database
    await newSilo.save();

    // Emit the new list of feeds to all websocket clients
    emitUpdatedSilos();

    res.sendStatus(200)
});

app.post("/api/updateSilo", async (req, res) => {

    const formData = req.body;
    const newSilo = new Silo({
        name: formData.name,
        id: formData.id,
        api: formData.api,
        members: formData.members,
        state: formData.state,
    })
    
    await updateSilo(newSilo.id, newSilo);

    emitUpdatedSilos();
    res.sendStatus(200)
});

app.get("/api/toggleSilo", async (req, res) => {
    if(req.query.id === undefined){
        res.send("Error! No id specified")
    } else {
        var id = (req.query.id).toString();
        await toggleSilo(id)

        emitUpdatedSilos();
        res.sendStatus(200);
    }
});


app.listen(expressPort);