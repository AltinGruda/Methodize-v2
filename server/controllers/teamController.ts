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

// Lists every team and it's members to the team leader
export const listTeamsWithMembers = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id

        // Find teams where the user is the owner
        const teams = await Team.find({ owner: userId });

        if (teams.length === 0) {
            return res.json('User is not the owner of any teams.');
        }

        // Iterate through teams and get members for each team
        const teamsWithMembers = await Promise.all(
            teams.map(async (team: any) => {
                const members = await User.find({ teams: team._id });
                return { team: team.name, members: members.map((member: any) => member.name) };
            })
        );

        res.json(teamsWithMembers);
    } catch (error) {
        console.log(error);
        res.json('Error listing teams with members');
    }
}
