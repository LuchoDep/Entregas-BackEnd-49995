import { ProductService, UserService } from "../repository/index.js";
import { CustomError } from "../services/customError.services.js";
import { generateProductErrorInfo, generateProductErrorParam } from "../services/productError.services.js";
import { EError } from "../enums/EError.js";

export const getProducts = async (req, res) => {
    try {
        const pid = req.params.pid;
        const productos = await ProductService.getProducts(pid);

        if (productos) {
            res.status(200).json({
                status: "success",
                products: productos,
            });
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

        if (!producto) {
            throw CustomError.createError({
                name: "Product by ID error",
                cause: generateProductErrorParam(req.params.pid),
                message: "Error getting product by ID",
                errorCode: EError.INVALID_PARAM
            })
        }

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }

};

export const addProduct = async (req, res) => {

    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body;

        if (!req.body) {
            res.send(`<div>Error, la info no ha llegado correctamente. <a href="/create-product">Intente de nuevo</a></div>`)
        }

        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            throw CustomError.createError({
                name: "Product create error",
                cause: generateProductErrorInfo(req.body),
                message: "Error creando el producto",
                errorCode: EError.EMPTY_FIELDS
            })
        }

        const user = req.user ? req.user._id : "admin" || "premium";
        const owner = await UserService.getUserById(user)
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            owner: owner
        }

        const result = await ProductService.addProduct(product);
        res.send("Se ha creado el producto correctamente", result)

    } catch (error) {
        if (error.cause) {
            req.logger.warn("error 400 creando el producto")
            res.status(400).json({ message: error.message, cause: error.cause });
        } else {
            req.logger.error("error creando el producto")
            res.send(`<div>Error, <a href="/create-product">Intente de nuevo</a></div>`)
        }
    }
};

export const updateProduct = async (req, res) => {

    try {
        const pid = req.params.pid;
        const user = req.user;
        const checkOwner = await UserService.getUserById(user);
        const product = await ProductService.getProductById(pid);

        if (checkOwner !== product.owner) {
            res.send(`No estas autorizado a actualizar este producto.`)
        };

        const { title, description, price, thumbnail, code, stock, category } = req.body;

        const productUpdated = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        };

        const result = await ProductService.updateProduct(pid, productUpdated);
        res.send("Producto actualizado");
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteProduct = async (req, res) => {

    try {
        const pid = req.params.pid;
        const user = req.user;
        const checkOwner = await UserService.getUserById(user);
        const product = await ProductService.getProductById(pid)

        if (checkOwner !== product.owner) {
            res.send(`No estas autorizado a eliminar este producto.`)
        }

        const result = await ProductService.deleteProduct(pid);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};