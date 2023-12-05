import express from 'express';
import { create, listTeams, getTeamById, addUserToTeam, getAllTeamUsers } from '../controllers/teamController';
const router = express.Router();

router.post('/create', create);
router.get('/list/:id', listTeams);
router.get('/:id', getTeamById);
// router.post('/join-team/:teamId/:email', sendRequest);
// router.put('/accept-request/:teamId/:email', handleResponse)
router.post('/:teamId/user/:userId', addUserToTeam);
router.get('/team-users/:teamId', getAllTeamUsers);

export default router;