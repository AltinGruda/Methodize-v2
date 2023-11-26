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
exports.listTeams = exports.create = void 0;
const Team_1 = __importDefault(require("../models/Team"));
// Create a team with the owner being the user who created it
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, owner } = req.body;
        const team = yield Team_1.default.create({
            name,
            owner,
            members: [{ user: owner, status: 'accepted' }],
        });
        res.json(team);
    }
    catch (error) {
        console.log(error);
        res.json('Error creating the team.');
    }
});
exports.create = create;
// Get a list of teams of an user
const listTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const teams = yield Team_1.default.find({ 'members.user': userId });
        res.json(teams);
    }
    catch (error) {
        console.log(error);
        res.json('Error listing teams of the user');
    }
});
exports.listTeams = listTeams;
