import { Router } from 'express';
import { createCustomer, getCustomer, getCustomers, putCustomer } from '../controllers/customersController.js';
import { validateCustomers } from '../middlewares/validateCustomers.js';
import { customersSchema, customersSchemaRules } from '../schemas/customersSchema.js';

const customersRouter = Router()
customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getCustomer)
customersRouter.post('/customers', validateCustomers(customersSchema, customersSchemaRules), createCustomer)
customersRouter.put('/customers/:id', validateCustomers(customersSchema, customersSchemaRules), putCustomer)

export default customersRouter;