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
exports.getAllTeamUsers = exports.addUserToTeam = exports.listTeams = exports.getTeamById = exports.create = void 0;
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
// Everything commented is disabled atm
// // Send request to a fullnamed user
// export const sendRequest = async (req: Request, res: Response) => {
//     try {
//         const { teamId, email } = req.params; 
//         const userDetails = await User.find({email: email});
//         if(!userDetails){
//             res.json("User is not found!");
//         }
//         const team = await Team.findByIdAndUpdate(
//             teamId,
//             { $push: {
//                 members: {
//                     user: {
//                         _id: userDetails[0]._id, // Assuming you want the first user if multiple found
//                         fullname: userDetails[0].fullname,
//                         email: userDetails[0].email,
//                     },
//                     status: 'pending' }} },
//             { new: true } //You should set the new option to true to return the document after update was applied.
//         );
//         res.json(team);
//     } catch (error) {
//         console.log(error);
//         res.json('Error sending the join team request.')
//     }
// }
// // Send the response (e.x: accepting the request to join a team)
// export const handleResponse = async (req: Request, res: Response) => {
//     try {
//         const { teamId, email } = req.params;
//         const userDetails = await User.find({email: email}); // Use findOne instead of find
//         if (!userDetails) {
//             return res.json('User not found.');
//         }
//         const team = await Team.findOneAndUpdate(
//             {
//                 _id: teamId,
//                 'members.user._id': userDetails[0]._id,
//                 'members.status': 'pending',
//             },
//             { $set: { 'members.$.status': 'accepted' } },
//             { new: true }
//         );
//         res.json(team);
//     } catch (error) {
//         console.error(error);
//         res.json('Error handling the response of the team request.');
//     }
// };
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
