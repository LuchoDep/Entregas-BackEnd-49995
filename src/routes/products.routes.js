import { Router } from "express";
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller.js";
import { checkRole } from "../middlewares/auth.js";
import { addLogger } from "../config/logger.config.js";
import { errorHandler} from "../middlewares/errorHandler.js";

const productRouter = Router();

productRouter.use((err, req, res, next) => {
    errorHandler(err, req, res, next)
})

productRouter.get('/', addLogger, getProducts);

productRouter.get("/:pid", addLogger, getProductById);

productRouter.post("/", addLogger, addProduct);

productRouter.put("/:pid", addLogger, checkRole(["admin", "premium"]), updateProduct);

productRouter.delete("/:pid", addLogger, checkRole(["admin", "premium"]), deleteProduct);

export default productRouter;
