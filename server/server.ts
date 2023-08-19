import { Feed, getAllFeeds, getFeed, deleteFeed } from "./classes/feed";
import bodyParser from "body-parser";
import { v4 } from 'uuid';
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { FeedDocument } from "./services/mongo";
import { ListCollectionsCursor } from "mongodb";

// Instantiate Express API
const app = express();
const expressPort: number = 8123;

// Instantiate Websocket
const http = require('node:http').Server(app);
const ioPort: number = 8000;
const io = new Server(http, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

http.listen(ioPort, function(){
    console.log(`Listening for sockets on port ${ioPort}`)
});

io.on("connection", async function(socket: any) {
    console.log("a user connected");
    var data = getAllFeeds();

    data.then( f => {
        socket.emit("allfeeds", f)
        console.log(`This thing!! ${f}`)
    })
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/*
app.get("/api/allfeeds", (req, res) => {
    var all = getAllFeeds();

    all.then(f => {
        io.emit("allfeeds", JSON.stringify(f))
        res.send(f)
    })
})
*/

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
        var id = (req.query.id).toString();

        const deleteResult = deleteFeed(id);

        if (deleteResult !== null) {
            var data = getAllFeeds();

            data.then( f => {
                io.sockets.emit("allfeeds", f)
                console.log(`better update ${f}`)
            })
            res.sendStatus(200)
        } else {
            res.send("No feed found with the given id.");
        }
    }
});




app.post("/api/createFeed", (req, res) => {
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

    newFeed.save()
    res.sendStatus(200)
});

app.listen(expressPort);