import { Router } from "express";
import __dirname from "../utils.js"
import ProductManagerDB from "../dao/db/productManagerDb.js";
import productModel from "../dao/models/product.model.js";

const router = Router();
const productManager = new ProductManagerDB();

const publicAccess = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

router.get('/products', privateAccess, async (req, res) => {
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

        const modelLimit = limit ? parseInt(limit, 9) : 9;
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

router.get('/', privateAccess, async (req, res) => {
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

        const modelLimit = limit ? parseInt(limit, 9) : 9;
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

        res.render("home", { products, user: req.session.user })

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Hubo un problema al obtener los productos' });
    }
});


router.get('/', privateAccess, async (req, res) => {
    try {
        const products = await productManager.consultarProductos();

        res.render('home', { products, user: req.session.user });

    } catch (error) {

        console.error('Error al obtener la lista de productos:', error.message);
        res.status(500).send('Error interno del servidor');

    }
});


router.get("/chat", publicAccess, async (req, res) => {

    res.render('chat', {});

});

router.get('/register', publicAccess, (req, res) => {
    res.render('register')
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login')
});

router.get('/profile', (req, res) => {
    res.render('profile', { user: req.session.user });
});

export default router