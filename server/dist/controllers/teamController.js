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
exports.handleResponse = exports.sendRequest = exports.listTeams = exports.getTeamById = exports.create = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const User_1 = __importDefault(require("../models/User"));
const mongoose = require('mongoose');
// Create a team with the owner being the user who created it
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, owner } = req.body;
        const ownerDetails = yield User_1.default.findById(owner);
        if (!ownerDetails) {
            res.json('Owner is not a user.');
        }
        const team = yield Team_1.default.create({
            name,
            owner,
            members: [
                {
                    user: ownerDetails,
                    status: 'accepted'
                }
            ],
        });
        res.json(team);
    }
    catch (error) {
        console.log(error);
        res.json('Error creating the team.');
    }
});
exports.create = create;
const getTeamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamId = req.params.id;
        const team = yield Team_1.default.findById(teamId);
        res.json(team);
    }
    catch (error) {
        console.log(error);
        res.json('Error listing teams by team id');
    }
});
exports.getTeamById = getTeamById;
// Get a list of teams of an user
const listTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const teams = yield Team_1.default.find({ 'members.user._id': userId });
        res.json(teams);
    }
    catch (error) {
        console.log(error);
        res.json('Error listing teams of the user');
    }
});
exports.listTeams = listTeams;
// Send request to a fullnamed user
const sendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId, fullname } = req.params;
        const userDetails = yield User_1.default.find({ fullname });
        console.log(userDetails);
        if (!userDetails) {
            res.json("User is not found!");
        }
        const team = yield Team_1.default.findByIdAndUpdate(teamId, { $push: {
                members: {
                    user: {
                        _id: userDetails[0]._id, // Assuming you want the first user if multiple found
                        fullname: userDetails[0].fullname,
                        email: userDetails[0].email,
                    },
                    status: 'pending'
                }
            } }, { new: true } //You should set the new option to true to return the document after update was applied.
        );
        res.json(team);
    }
    catch (error) {
        console.log(error);
        res.json('Error sending the join team request.');
    }
});
exports.sendRequest = sendRequest;
// Send the response (e.x: accepting the request to join a team)
const handleResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId, fullname } = req.params;
        const userDetails = yield User_1.default.findOne({ fullname }); // Use findOne instead of find
        if (!userDetails) {
            return res.json('User not found.');
        }
        const team = yield Team_1.default.findOneAndUpdate({
            _id: teamId,
            'members.user._id': userDetails._id,
            'members.status': 'pending',
        }, { $set: { 'members.$.status': 'accepted' } }, { new: true });
        if (!team) {
            return res.json('User has not been invited to the team.');
        }
        res.json(team);
    }
    catch (error) {
        console.error(error);
        res.json('Error handling the response of the team request.');
    }
});
exports.handleResponse = handleResponse;
