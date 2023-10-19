import app from "./app";
import {Db, MongoClient} from "mongodb";

const port: number = Number(process.env.PORT) ?? 3000;

const dbName: string = process.env.DB_NAME!;
const dbUrl: string = process.env.DB_URL!;
const client: MongoClient = new MongoClient(dbUrl);

client.connect().then((res) => {
  console.log("DB CONNECTED SUCCESSFULLY");
});

const server = app.listen(port, () => {
  console.log(`Server is up at http://localhost:${port}`);
});

export const db: Db = client.db(dbName);
