import {NextFunction, Request, Response} from "express";
import {db} from "../server";
import {randomFill} from "crypto";
import {ObjectId} from "mongodb";

export default class Journal {
  constructor() {}

  async creatJournal(req: Request, res: Response, next: NextFunction) {
    try {
      const {body} = req;

      await db
        .collection("Journals")
        .insertOne({user_id: (req as any).user._id, journal: body.journal});
      res.status(201).json({
        message: "Journal created",
      });
    } catch (err) {
      res.status(500).json({
        message: "SOmething went wrong",
      });
    }
  }

  async getJournals(req: Request, res: Response, next: NextFunction) {
    try {
      const journals = await db
        .collection("Users")
        .aggregate([
          {$match: {username: (req as any).user.username}},
          {
            $lookup: {
              from: "Journals",
              localField: "_id",
              foreignField: "user_id",
              as: "journals",
            },
          },
          {
            $project: {journals: 1, _id: 0},
          },
        ])
        .toArray();

      console.log(journals);

      res.status(200).json({journals: journals[0].journals});
    } catch (err) {
      console.log(err);

      res.status(500).json({messsage: "SOmething went wrong"});
    }
  }
}
