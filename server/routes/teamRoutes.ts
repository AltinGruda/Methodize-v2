import express from 'express';
import { create, listTeams } from '../controllers/teamControllers';
const router = express.Router();

router.post('/create', create);
router.get('/list/:id', listTeams);

export default router;