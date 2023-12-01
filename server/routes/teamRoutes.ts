import express from 'express';
import { create, handleResponse, listTeams, sendRequest, getTeamById } from '../controllers/teamController';
const router = express.Router();

router.post('/create', create);
router.get('/list/:id', listTeams);
router.get('/:id', getTeamById);
router.post('/join-team/:teamId/:fullname', sendRequest);
router.put('/accept-request/:teamId/:fullname', handleResponse)

export default router;