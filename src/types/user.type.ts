import {Document} from "mongodb";

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  phone_number: string;
  emergency_contact: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
