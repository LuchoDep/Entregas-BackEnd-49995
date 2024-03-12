import { ProductService } from "../repository/index.js";

export const getProducts = async (req, res) => {
    try {
        const pid = req.params.pid;
        const productos = await ProductService.getProducts(pid);

        if (productos) {
            res.json(productos);
        } else {
            res.status(404).json({ error: 'No se encontraron productos' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Hubo un problema al obtener los productos' });
    }
};


export const getProductById = async (req, res) => {

    try {
        const pid = req.params.pid;
        const producto = await ProductService.getProductById(pid);
        // console.log("producto del controller:", producto);

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
    
        await ProductService.addProduct(product);
        res.status(200).send("Producto agregado");

    } catch (error) {
        res.send({status:"error", message:error.message});
    }

};

export const updateProduct = async (req, res) => {

    try {
        const id = req.params.pid;
        const update = req.body;

        await ProductService.updateProduct(id, update);
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