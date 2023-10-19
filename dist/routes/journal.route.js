"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const journal_controller_1 = __importDefault(require("../controller/journal.controller"));
const auth = new auth_controller_1.default();
const journal = new journal_controller_1.default();
const router = express_1.default.Router();
router.get("/", auth.isAuthenticated, journal.getJournals);
router.post("/", auth.isAuthenticated, journal.creatJournal);
exports.default = router;
