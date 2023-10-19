import express, {Express} from "express";
import userRoute from "./routes/user.route";
import journalRoute from "./routes/journal.route";

const app: Express = express();

app.use(express.json());

app.use("/v1/users", userRoute);
app.use("/v1/journals", journalRoute);

export default app;
