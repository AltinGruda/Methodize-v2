"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authControllers_1 = require("../controllers/authControllers");
//Main Routes - simplified for now
router.post("/login", authControllers_1.postLogin);
router.get("/logout", authControllers_1.logout);
router.post("/signup", authControllers_1.postSignup);
router.get("/user", authControllers_1.getUser);
exports.default = router;
