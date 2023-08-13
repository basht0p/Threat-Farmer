import { Feed, getAllFeeds} from "./classes/feed";
import { v4 } from 'uuid';
import cors from "cors";
import express from "express";


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
    map: []
})

allFeeds.push(newConfig1, newConfig2)

allFeeds.forEach( f => {
    f.save()
})

app.listen(port);