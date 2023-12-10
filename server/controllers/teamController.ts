import { Request, Response } from "express";
import Team from "../models/Team";
import User from "../models/User";
const mongoose = require('mongoose');


// Create a team with the owner being the user who created it
export const create = async (req: Request, res: Response) => {
    try {
        const { name, owner } = req.body;
        const ownerDetails = await User.findById(owner);
        if(!ownerDetails) {
            res.json('Owner is not a user.');
        }

        const team = await Team.create({
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
        await User.findByIdAndUpdate(owner, { $push: { teams: team._id } });

        res.json(team);
    } catch (error) {
        console.log(error);
        res.json('Error creating the team.');
    }
}

export const getTeamById = async (req: Request, res: Response) => {
    try {
        const teamId = req.params.id;
        const team = await Team.findById(teamId);
        res.json(team)
    } catch (error) {
        console.log(error);
        res.json('Error listing teams by team id');
    }
}

// Get a list of teams of an user
export const listTeams = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const teams = await Team.find({'members.user_id': userId});
        res.json(teams);
    } catch (error) {
        console.log(error);
        res.json('Error listing teams of the user');
    }
} 

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
export const addUserToTeam = async (req: Request, res: Response, ) => {
    try {
        const team_id = req.params.teamId;
        const user_id = req.params.userId;
        const team = await Team.findOneAndUpdate({
              _id: team_id,
          },
          {
            $push: {
                members:
                {
                        user_id: user_id,
                    status: 'accepted'
                }
            }
          }
        );

        await User.findOneAndUpdate({_id: user_id}, {
            $push: { teams: team_id },
        })

        res.json(team);
    } catch (error) {
        console.log(error);
    }
}

export const getAllTeamUsers = async (req: Request, res: Response) => {
    try {
        const { teamId } = req.params

        // Find all users with the specified teamId
        const users = await User.find({ teams: teamId });

        if(!users) {
            res.json('No users are in this team.')
        }

        return res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const removeUser = async (req: Request, res: Response) => {
    try {
        const { teamId, userId } = req.params;

        // Check if the team and user exist
        const team = await Team.findById(teamId);
        const user = await User.findById(userId);

        if (!team || !user) {
            return res.status(404).json('Team or user not found.');
        }

        // Remove the user from the team
        const userIndex = team.members.findIndex((member: any) => member.user_id.toString() === userId);
        if (userIndex !== -1) {
            team.members.splice(userIndex, 1);
            await team.save();
        }

        return res.json('User removed from the team.');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Error removing user from the team.');
    }
};