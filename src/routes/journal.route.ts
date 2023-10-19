import express, {Router} from "express";
import Auth from "../controller/auth.controller";
import Journal from "../controller/journal.controller";

const auth = new Auth();
const journal = new Journal();
const router: Router = express.Router();

router.get("/", auth.isAuthenticated, journal.getJournals);
router.post("/", auth.isAuthenticated, journal.creatJournal);

export default router;
