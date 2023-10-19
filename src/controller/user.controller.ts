/**
 * REFACTORING AND STRICT TYPE CHECK REQUIRED
 */
import {User as UserDetails} from "../types/user.type";

import {NextFunction, Request, Response} from "express";
import {db} from "../server";
import {ObjectId, WithId} from "mongodb";
export default class User {
  constructor() {}

  async getUsers(req: Request, res: Response, next: NextFunction) {
    const users = <WithId<UserDetails>[]>(
      await db.collection("Users").find().toArray()
    );
    res.status(200).json(users);
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = <WithId<UserDetails>>await db.collection("Users").findOne(
        {_id: new ObjectId((req as any).user._id)},
        {
          projection: {
            username: 1,
            phone_number: 1,
            email: 1,
            emergency_contact: 1,
          },
        }
      );
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({message: "Something went wrong"});
    }
  }
}
