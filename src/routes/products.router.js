import { Router } from "express";
import __dirname from "../utils.js"
import ProductManagerDB from "../dao/db/productManagerDb.js"
import productModel from "../dao/models/product.model.js";

const productRouter = Router();
const prodManager = new ProductManagerDB();

productRouter.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query, category } = req.query;

        const sortObjectMapper = {
            asc: { price: 1 },
            desc: { price: -1 },
        };

        const sortOption = sort ? sortObjectMapper[sort] : undefined;

        const modelQuery = query ? { $text: { $search: query } } : {};
        if (category) {
            modelQuery.category = category;
        }

        const modelLimit = limit ? parseInt(limit, 10) : 10;
        const modelPage = page ? parseInt(page, 10) : 1;

        const products = await productModel.paginate(modelQuery, {
            limit: modelLimit,
            page: modelPage,
            sort: sortOption,
        });

        const response = {
            status: 'success',
            payload: products.docs,
            totalDocs: products.totalDocs,
            limit: products.limit,
            totalPages: products.totalPages,
            page: products.page,
            pagingCounter: products.pagingCounter,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
        };

        if (products.hasPrevPage) {
            response.prevPage = `${req.protocol}://${req.get('host')}${req.baseUrl}?limit=${modelLimit}&page=${products.prevPage}`;
        }
        if (products.hasNextPage) {
            response.nextPage = `${req.protocol}://${req.get('host')}${req.baseUrl}?limit=${modelLimit}&page=${products.nextPage}`;
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Hubo un problema al obtener los productos' });
    }
});

productRouter.get("/:pid", async (req, res) => {
    const pid = req.params.pid;

    try {
        const producto = await prodManager.getProductById(pid);
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

    await prodManager.addProduct(product);
    res.status(200).send("Producto agregado");
});

productRouter.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const update = req.body;
    await prodManager.updateProduct(id, update);
    res.send("Producto actualizado");
});

productRouter.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    await prodManager.deleteProduct(id);
    res.send("Producto eliminado");
});

export default productRouter;
