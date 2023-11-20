import { getAllFeeds } from "./classes/feed";
import { getAllSilos } from "./classes/silo";
import { Server, Socket } from "socket.io";
import { app } from "./server";
import config from "../config/config";

const ioPort: number = 8000;

export const http = require('node:http').Server(app);

export const io = new Server(http, {
    cors: {
    origin: `http://${config.domainName}`,
    methods: ["GET", "POST"]
    }
});

http.listen(ioPort, "0.0.0.0", function(){
    console.log(`Listening for websocket connections on port ${ioPort}`)
});


export function emitUpdatedFeeds(){
    var data = getAllFeeds();

    data.then( f => {
        io.sockets.emit("UpdatedFeeds", f)
    })
}

export function emitUpdatedSilos(){
    var data = getAllSilos();

    data.then( s => {
        io.sockets.emit("UpdatedSilos", s)
    })
}

io.on("connection", async function(socket: Socket) {
    emitUpdatedFeeds();
    emitUpdatedSilos();
})