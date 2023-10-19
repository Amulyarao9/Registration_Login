/**
 * PROPER REFACTORING REQUIRED
 */

import {NextFunction, Request, Response} from "express";
import {db} from "../server";
import {checkPassword, hashPassword} from "../utils/bcrypt";
import {Document, ObjectId, WithId} from "mongodb";
import jwt from "jsonwebtoken";
import {User as UserDetails} from "../types/user.type";
export default class Auth {
  constructor() {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      // username, email, phone number, emergency contact, role
      const {
        username,
        email,
        password,
        confirm_password,
        phone_number,
        emergency_contact,
      }: {
        username: string;
        email: string;
        password: string;
        confirm_password: string;
        phone_number: string;
        emergency_contact: string;
      } = {...req.body};

      if (
        !username ||
        !email ||
        !password ||
        !confirm_password ||
        !phone_number ||
        !emergency_contact
      ) {
        return res.status(400).json({
          message:
            "User must provide 'username', 'email', 'password', 'confirm_password', 'phone_number', 'emergency_contact' field.",
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

      const user = <WithId<UserDetails>[]>await db
        .collection("Users")
        .find({$or: [{username}, {email}, {phone_number}]})
        .toArray();

      if (user.length > 0) {
        return res.status(400).json({
          message: "Username or email or phone number alreaddy taken.",
        });
      }
      const hashedPassword = await hashPassword(password);

      await db.collection("Users").insertOne({
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
    } catch (err) {
      res.status(500).json({
        message: "Soething went wrong",
      });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const {username, password}: {username: string; password: string} =
        req.body;

      if (!username || !password) {
        return res.status(401).json({
          message: "Username or Password not provided.",
        });
      }

      const user = <WithId<UserDetails>>(
        await db.collection("Users").findOne({username})
      );

      if (!user || !(await checkPassword(user.password, password))) {
        return res.status(401).json({
          message: "Username or Password does not match",
        });
      }

      const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      res.status(200).json({
        messsage: "Logged in.",
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Soething went wrong",
      });
    }
  }

  async isAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        !req.headers.authorization ||
        (req.headers.authorization &&
          req.headers.authorization.split(" ")[0] !== "Bearer")
      ) {
        return res.status(401).json({
          message: "You are not authenticated.",
        });
      }

      const token = req.headers.authorization.split(" ")[1];

      const decodedData = new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
          if (!err) {
            return resolve(payload);
          }

          return res.status(401).json({mesasge: "falied"});
        });
      });

      (req as any).user = <WithId<UserDetails>>(
        await db
          .collection("Users")
          .findOne({_id: new ObjectId(((await decodedData) as any).userId)})
      );

      next();
    } catch (err) {
      res.status(401).json({message: "Ivalid JWT"});
    }
  }

  async isAuthorised(req: Request, res: Response, next: NextFunction) {
    const user = <WithId<UserDetails>>(
      await db
        .collection("Users")
        .findOne({_id: new ObjectId((req as any).user._id)})
    );

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "You are not authorised to access this feature.",
      });
    }

    next();
  }
}
