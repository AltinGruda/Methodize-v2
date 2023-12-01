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
                    user: ownerDetails, 
                    status: 'accepted'
                }
            ],
          });
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
        const teams = await Team.find({'members.user._id': userId});
        res.json(teams);
    } catch (error) {
        console.log(error);
        res.json('Error listing teams of the user');
    }
} 

// Send request to a fullnamed user
export const sendRequest = async (req: Request, res: Response) => {
    try {
        const { teamId, fullname } = req.params; 
        const userDetails = await User.find({ fullname });
        console.log(userDetails);
        if(!userDetails){
            res.json("User is not found!");
        }

        const team = await Team.findByIdAndUpdate(
            teamId,
            { $push: {
                members: {
                    user: {
                        _id: userDetails[0]._id, // Assuming you want the first user if multiple found
                        fullname: userDetails[0].fullname,
                        email: userDetails[0].email,
                    },
                    status: 'pending' }} },
            { new: true } //You should set the new option to true to return the document after update was applied.
        );
        res.json(team);
    } catch (error) {
        console.log(error);
        res.json('Error sending the join team request.')
    }
}

// Send the response (e.x: accepting the request to join a team)
export const handleResponse = async (req: Request, res: Response) => {
    try {
        const { teamId, fullname } = req.params;
        const userDetails = await User.findOne({ fullname }); // Use findOne instead of find

        if (!userDetails) {
            return res.json('User not found.');
        }

        const team = await Team.findOneAndUpdate(
            {
                _id: teamId,
                'members.user._id': userDetails._id,
                'members.status': 'pending',
            },
            { $set: { 'members.$.status': 'accepted' } },
            { new: true }
        );

        if (!team) {
            return res.json('User has not been invited to the team.');
        }

        res.json(team);
    } catch (error) {
        console.error(error);
        res.json('Error handling the response of the team request.');
    }
};