import { Feed, getAllFeeds, getFeed, deleteFeed } from "./classes/feed";
import bodyParser from "body-parser";
import { v4 } from 'uuid';
import cors from "cors";
import express from "express";
import { Server, Socket } from "socket.io";

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


    function emitUpdatedFeeds(socket: Socket){
        var data = getAllFeeds();

        data.then( f => {
            socket.emit("UpdatedFeeds", f)
        })
    }

    io.on("connection", async function(socket: Socket) {
        console.log("New Connection");
        emitUpdatedFeeds(socket);
    })

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/ws/feeds", async (req, res) => {
    console.log("triggered")
    var data = await getAllFeeds();
    io.sockets.emit("UpdatedFeeds", data)
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
            var data = await getAllFeeds();
            console.log("deketered")
            io.sockets.emit("UpdatedFeeds", data)
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
    
    await newFeed.save()

    var data = getAllFeeds();

    data.then( f => {
        io.sockets.emit("UpdatedFeeds", f)
        console.log(`better update ${f}`)
    })

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
    
    await newFeed.update()

    var data = getAllFeeds();
    data.then( f => {
        io.sockets.emit("UpdatedFeeds", f)
        console.log(`better update ${f}`)
    })

    res.sendStatus(200)
});

app.listen(expressPort);