import { connectDB } from "../config/connectDb.config.js";
import CartManagerDb from "../dao/db/cartManagerDb.js";
import ProductManagerDB from "../dao/db/productManagerDb.js";

connectDB();
export const cartDao = new CartManagerDb();
export const productDao = new ProductManagerDB();
