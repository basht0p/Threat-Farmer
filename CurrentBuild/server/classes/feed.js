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
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFeed = exports.updateFeed = exports.deleteFeed = exports.getFeed = exports.getAllFeeds = exports.Feed = exports.legalFormats = exports.legalObservables = void 0;
const mongo_1 = require("../services/mongo");
exports.legalObservables = [
    "ip",
    "ipport",
    "domain",
    "url",
    "md5",
    "sha256"
];
exports.legalFormats = [
    "txt",
    "csv",
    "json"
];
class Feed {
    //// Define the full feed configuration
    constructor(obj) {
        this.map = [];
        this.name = obj.name;
        this.id = obj.id;
        this.format = obj.format;
        this.url = obj.url;
        this.observables = obj.observables;
        this.key = obj.key;
        this.state = obj.state;
        this.comments = obj.comments;
        this.headers = obj.headers;
        this.frequency = obj.frequency;
        this.purge = obj.purge;
        this.map = obj.map;
    }
    ;
    //// Adds a legal observable to the list for this feed
    addObservable(observable) {
        if (!exports.legalObservables.includes(observable)) {
            return `${this.id} (${this.name}): Illegal Observable ${observable}`;
        }
        else if (this.observables.includes(observable)) {
            return `${this.id} (${this.name}): Observable ${observable} already exists`;
        }
        else {
            this.observables.push(observable);
            return `${this.id} (${this.name}): Observable ${observable} added`;
        }
    }
    //// Removes a legal observable to the list for this feed
    removeObservable(observable) {
        if (!exports.legalObservables.includes(observable)) {
            return `${this.id} (${this.name}): Illegal observable ${observable}`;
        }
        else if (!this.observables.includes(observable)) {
            return `${this.id} (${this.name}): Observable ${observable} doesn't exist`;
        }
        else if (this.observables.length === 1) {
            return `${this.id} (${this.name}): Observable list can't be empty. Add a new one before removing ${observable}`;
        }
        else {
            const index = this.observables.indexOf(observable);
            this.observables.splice(index, 1);
            return `${this.id} (${this.name}): Observable ${observable} removed`;
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            var feed = new mongo_1.FeedDb(this);
            mongo_1.dataDb.createCollection(this.id);
            feed.save()
                .then(() => {
                console.log(`Successfully added configuration for ${feed.name} (${feed.id})`);
            });
        });
    }
}
exports.Feed = Feed;
function getAllFeeds() {
    return __awaiter(this, void 0, void 0, function* () {
        var r = yield mongo_1.FeedDb.find();
        const list = [];
        for (var i = 0; i < r.length; i++) {
            const feedResult = new Feed({
                id: `${r[i]._id}`,
                name: `${r[i].name}`,
                url: `${r[i].url}`,
                format: `${r[i].format}`,
                observables: r[i].observables,
                key: `${r[i].key}`,
                state: r[i].state,
                comments: r[i].comments,
                headers: r[i].headers,
                purge: r[i].purge,
                frequency: `${r[i].frequency}`,
                map: r[i].map
            });
            list.push(feedResult);
        }
        return list;
    });
}
exports.getAllFeeds = getAllFeeds;
function getFeed(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_1.FeedDb.findById(id);
    });
}
exports.getFeed = getFeed;
function deleteFeed(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield mongo_1.SiloDb.updateMany({ members: id }, { $pull: { members: id } });
        mongo_1.dataDb.dropCollection(id);
        console.log(result);
        return mongo_1.FeedDb.findByIdAndDelete(id);
    });
}
exports.deleteFeed = deleteFeed;
function updateFeed(id, newFeed) {
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_1.FeedDb.findByIdAndUpdate(id, newFeed).then(result => {
            if (result != undefined) {
                if (result._id.toString() == id) {
                    console.log(`Successfully updated ${newFeed.name} (${id})`);
                    return "Success";
                }
            }
            else {
                console.log("No result returned from update function.");
            }
        }).catch(err => {
            console.log(`An error occured with updating the DB: ${err}`);
        });
    });
}
exports.updateFeed = updateFeed;
function toggleFeed(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const r = yield mongo_1.FeedDb.findById(id);
        if (r != undefined) {
            var newState = !r.state;
            const feedResult = new Feed({
                id: `${r._id}`,
                name: `${r.name}`,
                url: `${r.url}`,
                format: `${r.format}`,
                observables: r.observables,
                key: `${r.key}`,
                state: newState,
                comments: r.comments,
                headers: r.headers,
                purge: r.purge,
                frequency: `${r.frequency}`,
                map: r.map
            });
            return mongo_1.FeedDb.findByIdAndUpdate(id, feedResult).then(() => {
                if (newState) {
                    console.log(`Successfully enabled: ${id}`);
                }
                else {
                    console.log(`Successfully disabled: ${id}`);
                }
            });
        }
    });
}
exports.toggleFeed = toggleFeed;
//# sourceMappingURL=feed.js.map