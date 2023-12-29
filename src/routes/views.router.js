import { Router } from "express";
import __dirname from "../utils.js"
import ProductManagerDB from "../dao/db/productManagerDb.js";
import productModel from "../dao/models/product.model.js";
import messageModel from "../dao/models/message.model.js"

const router = Router();
const productManager = new ProductManagerDB();

router.get('/products', async (req, res) => {
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

        if (products.docs.length === 0) {
            return res.status(404).json({ error: 'No se encontraron resultados' });
        }

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

        res.render("home", { products })

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Hubo un problema al obtener los productos' });
    }
});

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
});

router.get("/chat", async(req, res) => {

    res.render('chat', {});

});

export default router