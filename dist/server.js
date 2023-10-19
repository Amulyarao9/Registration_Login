"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = __importDefault(require("./app"));
const mongodb_1 = require("mongodb");
const port = (_a = Number(process.env.PORT)) !== null && _a !== void 0 ? _a : 3000;
const dbName = process.env.DB_NAME;
const dbUrl = process.env.DB_URL;
const client = new mongodb_1.MongoClient(dbUrl);
client.connect().then((res) => {
    console.log("DB CONNECTED SUCCESSFULLY");
});
const server = app_1.default.listen(port, () => {
    console.log(`Server is up at http://localhost:${port}`);
});
exports.db = client.db(dbName);
