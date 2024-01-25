import express from 'express';
import { create, listTeams, getTeamById, addUserToTeam, getAllTeamUsers, removeUser, listTeamsWithMembers } from '../controllers/teamController';
const router = express.Router();

router.post('/create', create);
router.get('/list/:id', listTeams);
router.get('/:id', getTeamById);
router.post('/:teamId/user/:userId', addUserToTeam);
router.get('/team-users/:teamId', getAllTeamUsers);
router.delete('/:teamId/remove-user/:userId', removeUser);
router.get('/list-leader-teams/:id', listTeamsWithMembers);

export default router;