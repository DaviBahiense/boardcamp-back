import { Router } from 'express';
import { finaliseRental, getRentals, insertRental } from '../controllers/rentalsController.js';
import { validateRent } from '../middlewares/validateRent.js';
import rentSchema from '../schemas/rentSchema.js';


const rentalsRouter = Router()
rentalsRouter.get('/rentals', getRentals)
rentalsRouter.post('/rentals', validateRent(rentSchema), insertRental)
rentalsRouter.post('/rentals/:id/return', finaliseRental)

export default rentalsRouter
