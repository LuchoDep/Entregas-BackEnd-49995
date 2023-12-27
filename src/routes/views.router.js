import { Router } from "express";
import __dirname from "../utils.js"
import ProductManager from "../dao/filesystem/ProductManager.js";

const router = Router();
const productManager = new ProductManager(__dirname + "/dao/filesystem/files/productos.json");


router.get(`/`, async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render(`home`, { products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
});

router.get('/chat', (req, res) => {
    res.render('chat');
});

export default router