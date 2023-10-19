"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const user = new user_controller_1.default();
const auth = new auth_controller_1.default();
const router = express_1.default.Router();
router.get("/", auth.isAuthenticated, auth.isAuthorised, user.getUsers);
router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/profile", auth.isAuthenticated, user.getProfile);
exports.default = router;
