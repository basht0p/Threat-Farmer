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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedDb = exports.FeedSchema = exports.SiloDb = exports.SiloSchema = exports.dataDb = void 0;
const mongoose = __importStar(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Initiate database connection
const ConnectionString = (_a = process.env.DB_CONN_STRING) !== null && _a !== void 0 ? _a : 'mongodb://127.0.0.1:27017/threatconfig';
const connection = mongoose.createConnection(ConnectionString);
const configDb = connection.useDb('threatconfig');
exports.dataDb = connection.useDb('threatdata');
exports.SiloSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    api: { type: String, required: true },
    members: { type: (Array), required: true },
    state: { type: Boolean, required: true }
});
exports.SiloDb = configDb.model("Silo", exports.SiloSchema);
exports.FeedSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    format: { type: String, required: true },
    observables: { type: (Array), required: true },
    key: { type: String, required: false },
    state: { type: Boolean, required: true },
    comments: { type: Boolean, required: true },
    headers: { type: Boolean, required: true },
    purge: { type: Boolean, required: true },
    frequency: { type: String, required: true },
    map: { type: (Array), required: false }
});
exports.FeedDb = configDb.model("Feed", exports.FeedSchema);
//# sourceMappingURL=mongo.js.map