import { Router } from 'express';
import { getCategories } from '../controllers/categoryController.js';

const categoriesRouter = Router()
categoriesRouter.get('/categories', getCategories)


export default categoriesRouter;