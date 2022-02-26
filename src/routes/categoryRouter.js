import { Router } from 'express';
import { getCategories, newCategory } from '../controllers/categoryController.js';
import { validaSchemaMiddleware } from '../middlewares/validaSchemaMiddleware.js'
import categorieSchema from '../schemas/categorieSchema.js'

const categoriesRouter = Router();
categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", validaSchemaMiddleware(categorieSchema), newCategory);


export default categoriesRouter;