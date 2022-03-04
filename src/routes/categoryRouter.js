import { Router } from 'express';
import { getCategories, newCategory } from '../controllers/categoryController.js';
import { validateCategory } from '../middlewares/validateCategory.js'
import categorieSchema from '../schemas/categorieSchema.js'

const categoriesRouter = Router();
categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", validateCategory(categorieSchema), newCategory);


export default categoriesRouter;