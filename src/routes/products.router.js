import { Router } from "express";
import ProductManager from "../ProductManager.js";
const prodManager = new ProductManager("./files/productos.json");
const productRouter = Router();

productRouter.get("/", async (req, res) => {
    const limit = req.query.limit;

    try {
        const productos = await prodManager.getProductos();
        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error obteniendo productos' });
    }
});

productRouter.get("/:pid", async (req, res) => {
    const pid = req.params.pid;

    try {
        const producto = await prodManager.getProductosById(parseInt(pid));
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ error: 'Error obteniendo producto' });
    }
});

productRouter.post("/", async (req, res) => {
	const product = req.body;

	if (product.status === undefined) {
		product.status = true
	};

	await prodManager.addProducto(product);
	res.status(200).send("Producto agregado");
});

productRouter.put("/:pid", async (req, res) => {
	const id = parseInt(req.params.pid);
	const update = req.body;
	await prodManager.updateProducto(id, update);
	res.send("Producto actualizado");
});

productRouter.delete("/:pid", async (req, res) => {
	const id = parseInt(req.params.pid);
	await prodManager.deleteProducto(id);
	res.send("Producto eliminado");
});

export default productRouter;
