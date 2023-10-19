import express, {Router} from "express";
import User from "../controller/user.controller";
import Auth from "../controller/auth.controller";

const user = new User();
const auth = new Auth();
const router: Router = express.Router();

router.get("/", auth.isAuthenticated, auth.isAuthorised, user.getUsers);
router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/profile", auth.isAuthenticated, user.getProfile);

export default router;
