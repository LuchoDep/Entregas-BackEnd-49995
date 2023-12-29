import { Router } from "express";
import __dirname from "../utils.js"
import ProductManager from "../dao/filesystem/ProductManager.js";

const router = Router();
const productManager = new ProductManager(__dirname + "/dao/filesystem/files/productos.json");

router.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products })

});

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
});


export default router