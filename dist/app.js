"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const journal_route_1 = __importDefault(require("./routes/journal.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/v1/users", user_route_1.default);
app.use("/v1/journals", journal_route_1.default);
exports.default = app;
