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
const server_1 = require("../server");
const mongodb_1 = require("mongodb");
class User {
    constructor() { }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = (yield server_1.db.collection("Users").find().toArray());
            res.status(200).json(users);
        });
    }
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield server_1.db.collection("Users").findOne({ _id: new mongodb_1.ObjectId(req.user._id) }, {
                    projection: {
                        username: 1,
                        phone_number: 1,
                        email: 1,
                        emergency_contact: 1,
                    },
                });
                res.status(200).json(user);
            }
            catch (err) {
                res.status(500).json({ message: "Something went wrong" });
            }
        });
    }
}
exports.default = User;
