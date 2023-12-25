"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = require("../helpers/api");
const router = express_1.default.Router();
//@Get all rooms
router.get('/rooms', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield (0, api_1.fetchData)("rooms", "get");
        res.json(rooms);
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({ error: error.message });
    }
}));
//@Create a room with a name
router.post('/createRoom', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // object deconstruction happens here to manually set each room to expire in 1 hour.
        // 1 hour = 3600 seconds, we take the current Date seconds and add 3600 seconds which means the room expires in 1 hour time
        const body = Object.assign(Object.assign({}, req.body), { properties: {
                exp: Math.floor(Date.now() / 1000 + 3600)
            } });
        const roomCreated = yield (0, api_1.fetchData)("rooms", "post", body);
        res.json(roomCreated);
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({ error: error.message });
    }
}));
//@Get a room via the name
router.get('/getRoom/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield (0, api_1.fetchData)(`rooms/${req.params.name}`, "get");
        res.json(room);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
