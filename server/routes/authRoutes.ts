import express from "express";
const router = express.Router();
import {postLogin, postSignup, logout, getUser} from "../controllers/authControllers";


//Main Routes - simplified for now
router.post("/login", postLogin);
router.get("/logout", logout);
router.post("/signup", postSignup);
router.get("/user", getUser);

export default router;