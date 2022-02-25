import { Router } from 'express';
import { getCustomers } from '../controllers/customersController.js';

const customersRouter = Router()
customersRouter.get('/cutomers', getCustomers)


export default customersRouter;