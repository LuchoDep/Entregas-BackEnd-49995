import { Router } from "express";
import {
    getCarts,
    getCartById,
    createCart,
    addProductToCart,
    deleteCart,
    deleteProductFromCart,
    updatedCart,
    updateProductQuantity
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.get('/', getCarts);

cartRouter.get('/:cid', getCartById);

cartRouter.post("/", createCart);

cartRouter.post('/:cid/product/:pid', addProductToCart);

cartRouter.delete("/:cid", deleteCart);

cartRouter.delete("/:cid/product/:pid", deleteProductFromCart);

cartRouter.put("/:cid", updatedCart);

cartRouter.put("/:cid/product/:pid", updateProductQuantity);


export default cartRouter;