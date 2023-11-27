import { getAllFeeds } from "./classes/feed";
import { getAllSilos } from "./classes/silo";
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { app, expressPort } from "./server";
import config from "../config/config";

const ioPort: number = 8000;

const httpServer: HTTPServer = app.listen(expressPort, function() {
    console.log(`Express and WebSocket server running on port`);
});

export const io = new SocketIOServer(httpServer, {
    cors: {
    origin: `http://${config.domainName}`,
    methods: ["GET", "POST"]
    }
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