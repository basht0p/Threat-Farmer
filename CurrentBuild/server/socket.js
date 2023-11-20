"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitUpdatedSilos = exports.emitUpdatedFeeds = exports.io = exports.http = void 0;
const feed_1 = require("./classes/feed");
const silo_1 = require("./classes/silo");
const socket_io_1 = require("socket.io");
const server_1 = require("./server");
const config_1 = __importDefault(require("../config/config"));
const ioPort = 8000;
exports.http = require('node:http').Server(server_1.app);
exports.io = new socket_io_1.Server(exports.http, {
    cors: {
        origin: `http://${config_1.default.domainName}`,
        methods: ["GET", "POST"]
    }
});
exports.http.listen(ioPort, "0.0.0.0", function () {
    console.log(`Listening for websocket connections on port ${ioPort}`);
});
function emitUpdatedFeeds() {
    var data = (0, feed_1.getAllFeeds)();
    data.then(f => {
        exports.io.sockets.emit("UpdatedFeeds", f);
    });
}
exports.emitUpdatedFeeds = emitUpdatedFeeds;
function emitUpdatedSilos() {
    var data = (0, silo_1.getAllSilos)();
    data.then(s => {
        exports.io.sockets.emit("UpdatedSilos", s);
    });
}
exports.emitUpdatedSilos = emitUpdatedSilos;
exports.io.on("connection", function (socket) {
    return __awaiter(this, void 0, void 0, function* () {
        emitUpdatedFeeds();
        emitUpdatedSilos();
    });
});
//# sourceMappingURL=socket.js.map