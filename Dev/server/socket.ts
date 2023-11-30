import * as http from "http";
import { getAllFeeds } from "./classes/feed";
import { getAllSilos } from "./classes/silo";
import { Server, Socket } from "socket.io";
import { app, expressPort } from "./server";
import config from "../config/config";

const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
    cors: {
    origin: `https://${config.domainName}`,
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
    console.log("new connection")
    emitUpdatedFeeds();
    emitUpdatedSilos();
})

httpServer.listen(expressPort, () => {
    console.log(`Express and WebSocket server running on port ${expressPort}`);
  });