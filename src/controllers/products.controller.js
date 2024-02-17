import { productDao } from "../dao/index.js";

export const getProducts = async (req, res) => {

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

        const products = await productDao.paginate(modelQuery, {
            limit: modelLimit,
            page: modelPage,
            sort: sortOption,
        });

        if (products.docs.length === 0) {
            return res.status(404).json({ error: 'No se encontraron resultados' });
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Hubo un problema al obtener los productos' });
    }

};

export const getProductById = async (req, res) => {

    try {

        const pid = req.params.pid;

        const producto = await productDao.getProductById(pid);

        if (producto) {

            res.json(producto);

        } else {

            res.status(404).json({ error: 'Producto no encontrado' });

        }
    } catch (error) {

        console.error('Error obteniendo producto:', error);

        res.status(500).json({ error: 'Error obteniendo producto' });

    }

};

export const addProduct = async (req, res) => {

    try {

        const product = req.body;

        if (product.status === undefined) {
            product.status = true
        };
    
        await productDao.addProduct(product);
        res.status(200).send("Producto agregado");

    } catch (error) {
        res.send({status:"error", message:error.message});
    }

};

export const updateProduct = async (req, res) => {

    try {

        const id = req.params.pid;

        const update = req.body;

        await productDao.updateProduct(id, update);

        res.send("Producto actualizado");

    } catch (error) {
        res.send({status:"error", message:error.message});
    }

};

export const deleteProduct = async (req, res) => {

    try {

        const id = req.params.pid;

        await prodManager.deleteProduct(id);
        
        res.send("Producto eliminado");

    } catch (error) {
        res.send({status:"error", message:error.message})

    }

};