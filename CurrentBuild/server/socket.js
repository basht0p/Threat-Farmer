"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.emitUpdatedSilos = exports.emitUpdatedFeeds = exports.io = void 0;
const http = __importStar(require("http"));
const feed_1 = require("./classes/feed");
const silo_1 = require("./classes/silo");
const socket_io_1 = require("socket.io");
const server_1 = require("./server");
const config_1 = __importDefault(require("../config/config"));
const httpServer = http.createServer(server_1.app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: `https://${config_1.default.domainName}`,
        methods: ["GET", "POST"]
    }
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
        console.log("new connection");
        emitUpdatedFeeds();
        emitUpdatedSilos();
    });
});
httpServer.listen(server_1.expressPort, "0.0.0.0", () => {
    console.log(`Express and WebSocket server running on port ${server_1.expressPort}`);
});
//# sourceMappingURL=socket.js.map