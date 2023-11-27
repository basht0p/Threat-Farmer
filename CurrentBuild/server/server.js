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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.expressPort = void 0;
const feed_1 = require("./classes/feed");
const silo_1 = require("./classes/silo");
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const socket_1 = require("./socket");
const jobs_1 = require("./services/jobs");
const mongo_1 = require("./services/mongo");
// Define backend ports
exports.expressPort = 8080;
// Instantiate Express and properties
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
(0, jobs_1.startAgenda)();
// Routes
exports.app.use(express_1.default.static(path_1.default.join(__dirname, 'dist')));
//////////////////////
///                ///
///     FEEDS      ///
///                ///
//////////////////////
// this route just triggers an emit() for all the feeds
exports.app.get("/ws/feeds", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, socket_1.emitUpdatedFeeds)();
    res.sendStatus(200);
}));
exports.app.get("/api/getFeed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id === undefined) {
        res.send("Error! No id specified");
    }
    else {
        var id = (req.query.id).toString();
        const r = yield (0, feed_1.getFeed)(id);
        if (r !== null) {
            const feedResult = new feed_1.Feed({
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
            });
            res.send(feedResult);
        }
        else {
            res.send("No feed found with the given id.");
        }
    }
}));
exports.app.get("/api/deleteFeed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id === undefined) {
        res.send("Error! No id specified");
    }
    else {
        // Delete the requested feed
        var id = (req.query.id).toString();
        const deleteResult = yield (0, feed_1.deleteFeed)(id);
        if (deleteResult !== null) {
            // Send out the updated feed list
            (0, socket_1.emitUpdatedFeeds)();
            res.sendStatus(200);
        }
        else {
            res.send("No feed found with the given id.");
        }
    }
}));
exports.app.post("/api/createFeed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    const newFeed = new feed_1.Feed({
        name: formData.name,
        id: (0, uuid_1.v4)(),
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
    });
    // Write the new feed to the database
    yield newFeed.save();
    // Emit the new list of feeds to all websocket clients
    (0, socket_1.emitUpdatedFeeds)();
    res.sendStatus(200);
}));
exports.app.post("/api/updateFeed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    const newFeed = new feed_1.Feed({
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
    });
    yield (0, feed_1.updateFeed)(newFeed.id, newFeed);
    (0, socket_1.emitUpdatedFeeds)();
    res.sendStatus(200);
}));
exports.app.get("/api/toggleFeed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id === undefined) {
        res.send("Error! No id specified");
    }
    else {
        var id = (req.query.id).toString();
        yield (0, feed_1.toggleFeed)(id);
        (0, socket_1.emitUpdatedFeeds)();
        res.sendStatus(200);
    }
}));
//////////////////////
///                ///
///     SILOS      ///
///                ///
//////////////////////
// this route just triggers an emit() for all the silos
exports.app.get("/ws/silos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, socket_1.emitUpdatedSilos)();
    res.sendStatus(200);
}));
exports.app.get("/api/deleteSilo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id === undefined) {
        res.send("Error! No id specified");
    }
    else {
        // Delete the requested feed
        var id = (req.query.id).toString();
        const deleteResult = yield (0, silo_1.deleteSilo)(id);
        if (deleteResult !== null) {
            // Send out the updated feed list
            (0, socket_1.emitUpdatedSilos)();
            res.sendStatus(200);
        }
        else {
            res.send("No silo found with the given id.");
        }
    }
}));
exports.app.post("/api/createSilo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    const newSilo = new silo_1.Silo({
        name: formData.name,
        id: (0, uuid_1.v4)(),
        api: formData.api,
        members: formData.members,
        state: formData.state,
    });
    // Write the new feed to the database
    yield newSilo.save();
    // Emit the new list of feeds to all websocket clients
    (0, socket_1.emitUpdatedSilos)();
    res.sendStatus(200);
}));
exports.app.post("/api/updateSilo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    const newSilo = new silo_1.Silo({
        name: formData.name,
        id: formData.id,
        api: formData.api,
        members: formData.members,
        state: formData.state,
    });
    yield (0, silo_1.updateSilo)(newSilo.id, newSilo);
    (0, socket_1.emitUpdatedSilos)();
    res.sendStatus(200);
}));
exports.app.get("/api/toggleSilo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id === undefined) {
        res.send("Error! No id specified");
    }
    else {
        var id = (req.query.id).toString();
        yield (0, silo_1.toggleSilo)(id);
        (0, socket_1.emitUpdatedSilos)();
        res.sendStatus(200);
    }
}));
//////////////////////
///                ///
///    LOOKUPS     ///
///                ///
//////////////////////
exports.app.get("/lookup/:api/:subject", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let silo = yield mongo_1.SiloDb.findOne({ api: req.params.api });
    let subject = req.params.subject;
    if (silo === null) {
        res.sendStatus(404);
    }
    else if (!silo.state) {
        res.status(401).send("Silo is disabled");
    }
    else if (silo) {
        console.log(`Looking up ${req.params.subject} in ${req.params.api}`);
        let feeds = silo.members;
        let results = [];
        yield Promise.all(feeds.map((feed) => __awaiter(void 0, void 0, void 0, function* () {
            let feedData = mongo_1.dataDb.collection(feed);
            const feedConfig = yield mongo_1.FeedDb.findOne({ "_id": feed });
            if (feedConfig === null || feedConfig === void 0 ? void 0 : feedConfig.observables.includes("url")) {
                subject = decodeURI(subject);
            }
            let result = yield feedData.findOne({ "key": subject });
            if (result) {
                const { _id, key } = result, rest = __rest(result, ["_id", "key"]);
                results.push(rest);
            }
        })));
        if (results.length === 0) {
            res.sendStatus(204);
        }
        else {
            res.status(200).send(results);
        }
    }
}));
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
exports.app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname + '/dist/index.html'));
});
exports.app.listen(exports.expressPort, "0.0.0.0");
//# sourceMappingURL=server.js.map