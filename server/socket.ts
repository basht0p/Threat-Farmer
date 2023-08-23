import { getAllFeeds } from "./classes/feed";
import { Server, Socket } from "socket.io";
import { app } from "./server";

const ioPort: number = 8000;

export const http = require('node:http').Server(app);

export const io = new Server(http, {
    cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
    }
});

http.listen(ioPort, function(){
    console.log(`Listening for websocket connections on port ${ioPort}`)
});


export function emitUpdatedFeeds(){
    setTimeout(() => console.log(), 1000)
    var data = getAllFeeds();

    data.then( f => {
        console.log("Emitting updated feeds to all websocket clients...")
        io.sockets.emit("UpdatedFeeds", f)
    })
}

io.on("connection", async function(socket: Socket) {
    console.log("New Connection");
    emitUpdatedFeeds();
})