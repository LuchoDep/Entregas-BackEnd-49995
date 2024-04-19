import { Router } from "express";
import { generateMockProducts} from "../controllers/mock.controller.js";

const router = Router();

router.get('/mockingproducts', generateMockProducts);

export { router as mockRouter }