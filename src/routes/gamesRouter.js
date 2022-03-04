import { Router } from 'express';
import { getGames, postGames } from '../controllers/gamesController.js';
import { validateGame } from '../middlewares/validateGame.js';
import gameSchema from '../schemas/gameSchema.js';


const gamesRouter = Router()
gamesRouter.get('/games', getGames)
gamesRouter.post('/games', validateGame(gameSchema), postGames)

export default gamesRouter