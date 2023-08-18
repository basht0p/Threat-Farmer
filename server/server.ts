import { Feed, getAllFeeds, getFeed } from "./classes/feed";
import { FeedDocument } from "./services/mongo";
import { v4 } from 'uuid';
import cors from "cors";
import express, { json } from "express";
import mongoose from "mongoose";


const app = express();
const port: number = 8123;
app.use(cors())

var allFeeds: Array<Feed> = []

app.get("/api/allfeeds", (req, res) => {
    var all = getAllFeeds();

    all.then(f => {
        res.send(f)
    })
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

/*
const newConfig1 = new Feed({
    name: "feodo",
    id: v4(),
    url: "https://foo.com",
    format: "json",
    observables: ["ip", "ipport"],
    key: "ip",
    state: false,
    comments: false,
    headers: false,
    purge: true,
    frequency: "4h",
    map: []
})

const newConfig2 = new Feed({
    name: "feodo-ip-list",
    id: v4(),
    url: "https://foobie.com",
    format: "json",
    observables: ["ip", "domain"],
    key: "domain",
    state: true,
    comments: false,
    headers: false,
    purge: true,
    frequency: "15m",
    map: []
})

const newConfig3 = new Feed({
    name: "blocklist-de",
    id: v4(),
    url: "https://blklst.de",
    format: "txt",
    observables: ["ip"],
    key: "ip",
    state: true,
    comments: false,
    headers: false,
    purge: true,
    frequency: "15m",
    map: []
})

const newConfig4 = new Feed({
    name: "threatfox-url-list",
    id: v4(),
    url: "https://foobie.com",
    format: "json",
    observables: ["url"],
    key: "url",
    state: true,
    comments: false,
    headers: false,
    purge: true,
    frequency: "24h",
    map: []
})


allFeeds.push(newConfig1, newConfig2, newConfig3, newConfig4)

allFeeds.forEach( f => {
    f.save()
})
*/

app.listen(port);