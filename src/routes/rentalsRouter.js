import { Router } from 'express';
import { getRentals, insertRental } from '../controllers/rentalsController.js';
import { validateRent } from '../middlewares/validateRent.js';
import rentSchema from '../schemas/rentSchema.js';


const rentalsRouter = Router()
rentalsRouter.get('/rentals', getRentals)
rentalsRouter.post('/rentals', validateRent(rentSchema), insertRental)

export default rentalsRouter
