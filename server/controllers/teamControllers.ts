import { Request, Response } from "express";
import Team from "../models/Team";


// Create a team with the owner being the user who created it
export const create = async (req: Request, res: Response) => {
    try {
        const { name, owner } = req.body;
        const team = await Team.create({
            name,
            owner,
            members: [{ user: owner, status: 'accepted' }],
          });
          res.json(team);
    } catch (error) {
        console.log(error);
        res.json('Error creating the team.');
    }
}

// Get a list of teams of an user
export const listTeams = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const teams = await Team.find({ 'members.user': userId });
        res.json(teams);
    } catch (error) {
        console.log(error);
        res.json('Error listing teams of the user');
    }
} 