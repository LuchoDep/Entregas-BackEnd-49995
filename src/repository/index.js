import { connectDB } from "../config/connectDb.config.js";
import CartManagerDb from "../dao/db/cartManagerDb.js";
import CartRepository from "./cart.repository.js";
import ProductManagerDB from "../dao/db/productManagerDb.js";
import ProductRepository from "./product.repository.js";
import userManagerDb from "../dao/db/userManagerDb.js";
import UserRepository from "./user.repository.js";


connectDB();

export const cartDao = new CartManagerDb();
export const productDao = new ProductManagerDB();
export const userDao = new userManagerDb();



export const CartService = new CartRepository(cartDao, productDao);
export const ProductService = new ProductRepository(productDao);
export const UserService = new UserRepository(userDao);
