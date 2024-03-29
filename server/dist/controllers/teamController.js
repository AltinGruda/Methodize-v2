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
exports.listTeamsWithMembers = exports.removeUser = exports.getAllTeamUsers = exports.addUserToTeam = exports.listTeams = exports.getTeamById = exports.create = void 0;
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
                    user_id: owner,
                    status: 'accepted'
                }
            ],
        });
        // Update the user's teams array with the new team's ObjectId
        yield User_1.default.findByIdAndUpdate(owner, { $push: { teams: team._id } });
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
        const teams = yield Team_1.default.find({ 'members.user_id': userId });
        res.json(teams);
    }
    catch (error) {
        console.log(error);
        res.json('Error listing teams of the user');
    }
});
exports.listTeams = listTeams;
//Add other users to team
const addUserToTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const team_id = req.params.teamId;
        const user_id = req.params.userId;
        const team = yield Team_1.default.findOneAndUpdate({
            _id: team_id,
        }, {
            $push: {
                members: {
                    user_id: user_id,
                    status: 'accepted'
                }
            }
        });
        yield User_1.default.findOneAndUpdate({ _id: user_id }, {
            $push: { teams: team_id },
        });
        res.json(team);
    }
    catch (error) {
        console.log(error);
    }
});
exports.addUserToTeam = addUserToTeam;
const getAllTeamUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId } = req.params;
        // Find all users with the specified teamId
        const users = yield User_1.default.find({ teams: teamId });
        if (!users) {
            res.json('No users are in this team.');
        }
        return res.json(users);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllTeamUsers = getAllTeamUsers;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamId, userId } = req.params;
        // Check if the team and user exist
        const team = yield Team_1.default.findById(teamId);
        const user = yield User_1.default.findById(userId);
        if (!team || !user) {
            return res.status(404).json('Team or user not found.');
        }
        // Remove the user from the team
        const userIndex = team.members.findIndex((member) => member.user_id.toString() === userId);
        if (userIndex !== -1) {
            team.members.splice(userIndex, 1);
            yield team.save();
        }
        return res.json('User removed from the team.');
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Error removing user from the team.');
    }
});
exports.removeUser = removeUser;
// Lists every team and it's members to the team leader
const listTeamsWithMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        // Find teams where the user is the owner
        const teams = yield Team_1.default.find({ owner: userId });
        if (teams.length === 0) {
            return res.json('User is not the owner of any teams.');
        }
        // Iterate through teams and get members for each team
        const teamsWithMembers = yield Promise.all(teams.map((team) => __awaiter(void 0, void 0, void 0, function* () {
            const members = yield User_1.default.find({ teams: team._id });
            return { team: team.name, members: members.map((member) => member.name) };
        })));
        res.json(teamsWithMembers);
    }
    catch (error) {
        console.log(error);
        res.json('Error listing teams with members');
    }
});
exports.listTeamsWithMembers = listTeamsWithMembers;
