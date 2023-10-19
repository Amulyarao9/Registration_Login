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
class Journal {
    constructor() { }
    creatJournal(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                yield server_1.db
                    .collection("Journals")
                    .insertOne({ user_id: req.user._id, journal: body.journal });
                res.status(201).json({
                    message: "Journal created",
                });
            }
            catch (err) {
                res.status(500).json({
                    message: "SOmething went wrong",
                });
            }
        });
    }
    getJournals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const journals = yield server_1.db
                    .collection("Users")
                    .aggregate([
                    { $match: { username: req.user.username } },
                    {
                        $lookup: {
                            from: "Journals",
                            localField: "_id",
                            foreignField: "user_id",
                            as: "journals",
                        },
                    },
                    {
                        $project: { journals: 1, _id: 0 },
                    },
                ])
                    .toArray();
                console.log(journals);
                res.status(200).json({ journals: journals[0].journals });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ messsage: "SOmething went wrong" });
            }
        });
    }
}
exports.default = Journal;
