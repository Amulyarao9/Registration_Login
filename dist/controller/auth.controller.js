"use strict";
/**
 * PROPER REFACTORING REQUIRED
 */
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
const server_1 = require("../server");
const bcrypt_1 = require("../utils/bcrypt");
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Auth {
    constructor() { }
    signup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // username, email, phone number, emergency contact, role
                const { username, email, password, confirm_password, phone_number, emergency_contact, } = Object.assign({}, req.body);
                if (!username ||
                    !email ||
                    !password ||
                    !confirm_password ||
                    !phone_number ||
                    !emergency_contact) {
                    return res.status(400).json({
                        message: "User must provide 'username', 'email', 'password', 'confirm_password', 'phone_number', 'emergency_contact' field.",
                    });
                }
                if (phone_number.length != 10) {
                    return res.status(400).json({
                        message: "Invalid phone number",
                    });
                }
                if (password !== confirm_password) {
                    return res.status(400).json({
                        message: "Password fields does not match",
                    });
                }
                const user = yield server_1.db
                    .collection("Users")
                    .find({ $or: [{ username }, { email }, { phone_number }] })
                    .toArray();
                if (user.length > 0) {
                    return res.status(400).json({
                        message: "Username or email or phone number alreaddy taken.",
                    });
                }
                const hashedPassword = yield (0, bcrypt_1.hashPassword)(password);
                yield server_1.db.collection("Users").insertOne({
                    username,
                    password: hashedPassword,
                    role: "user",
                    email,
                    phone_number,
                    emergency_contact,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
                res.status(200).json({
                    message: "You're signed up. Please login.",
                });
            }
            catch (err) {
                res.status(500).json({
                    message: "Soething went wrong",
                });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                if (!username || !password) {
                    return res.status(401).json({
                        message: "Username or Password not provided.",
                    });
                }
                const user = (yield server_1.db.collection("Users").findOne({ username }));
                if (!user || !(yield (0, bcrypt_1.checkPassword)(user.password, password))) {
                    return res.status(401).json({
                        message: "Username or Password does not match",
                    });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
                    expiresIn: "7d",
                });
                res.status(200).json({
                    messsage: "Logged in.",
                    token,
                });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    message: "Soething went wrong",
                });
            }
        });
    }
    isAuthenticated(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.headers.authorization ||
                    (req.headers.authorization &&
                        req.headers.authorization.split(" ")[0] !== "Bearer")) {
                    return res.status(401).json({
                        message: "You are not authenticated.",
                    });
                }
                const token = req.headers.authorization.split(" ")[1];
                const decodedData = new Promise((resolve, reject) => {
                    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, payload) => {
                        if (!err) {
                            return resolve(payload);
                        }
                        return res.status(401).json({ mesasge: "falied" });
                    });
                });
                req.user = (yield server_1.db
                    .collection("Users")
                    .findOne({ _id: new mongodb_1.ObjectId((yield decodedData).userId) }));
                next();
            }
            catch (err) {
                res.status(401).json({ message: "Ivalid JWT" });
            }
        });
    }
    isAuthorised(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield server_1.db
                .collection("Users")
                .findOne({ _id: new mongodb_1.ObjectId(req.user._id) }));
            if (user.role !== "admin") {
                return res.status(403).json({
                    message: "You are not authorised to access this feature.",
                });
            }
            next();
        });
    }
}
exports.default = Auth;
