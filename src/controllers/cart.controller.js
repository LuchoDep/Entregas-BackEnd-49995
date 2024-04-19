import { CartService, UserService } from "../repository/index.js";
import { ticketsModel } from "../dao/models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export const getCarts = async (req, res) => {

    try {
        const carts = await CartService.getCarts();
        res.send({ status: "success", payload: carts });

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getCartById = async (req, res) => {

    try {
        const cid = req.params.cid;

        if (!cid) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        const result = await CartService.getCartById(cid);
        res.status(200).json({
            status: result.status,
            msg: result
        });

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const createCart = async (req, res) => {

    try {

        const cart = await CartService.createCart();

        return {
            status: "success",
            message: "Carrito creado correctamente",
            cart: cart
        };

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }

};

export const addProductToCart = async (req, res) => {

    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;

        const result = await CartService.addProductToCart(cid, pid, quantity);
        res.status(200).json({
            status: result.status,
            msg: result
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const deleteCart = async (req, res) => {

    try {
        const cid = req.params.cid;
        const deleteCart = await CartService.deleteCart(cid);

        if (deleteCart) {
            res.json({ message: `El carrito de ID ${cid} fue eliminado` });
        } else {
            res.status(404).json({ error: `El carrito de ID ${cid} no se encontró` });
        }

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }

};

export const deleteProductFromCart = async (req, res) => {

    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const cart = await CartService.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ error: "No se encontró el carrito" });
        }

        if (cart.quantity <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
        }

        await CartService.deleteProductFromCart(cid, pid);
        res.json({
            message: "Producto eliminado del carrito",
            pid: pid,
            cid: cid,
        });


    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }

};

export const updatedCart = async (req, res) => {

    try {

        const cid = req.params.cid;
        const updatedCartData = req.body;

        const cart = await CartService.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ error: "No se encontró el carrito" });
        }

        if (updatedCartData.products) {
            cart.products = [...cart.products, ...updatedCartData.products];
        }

        await cart.save();

        res.json({ message: "Carrito actualizado", cart });

    } catch (error) {
        res.send({ status: "error", message: error.message });
    }

};

export const updateProductQuantity = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const cart = await CartService.getCartById(cid);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).send('Producto no encontrado en el carrito');
        }

        const quantityChange = req.body.quantityChange;
        cart.products[productIndex].quantity += quantityChange;

        if (cart.products[productIndex].quantity <= 0) {
            cart.products.splice(productIndex, 1);
        }

        await cart.save();
        res.send('Cantidad actualizada');
    } catch (error) {
        console.error('Error en updateProductQuantityInCart:', error);
        res.status(500).json({ error: error.message });
    }
};

export const buyCart = async (req, res) => {
    try {
        const user = req.params.user;
        const cid = req.params.cid;

        const cart = await CartService.getCartById(cid);
        console.log(cart);
        if (!cart) return res.status(404).send('Carrito no encontrado');

        const totalAmount = cart.products.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
        const productsToUpdate = [];
        const productsNotAvailable = [];

        cart.products.forEach(item => {
            const product = item.product;

            console.log("Precio del producto:", product.price);
            console.log("Cantidad del producto:", item.quantity);

            if (product.stock < item.quantity) {
                productsNotAvailable.push({ productId: product._id, title: product.title });
            } else {
                productsToUpdate.push({ product, quantity: item.quantity });
            }
        });

        if (productsNotAvailable.length === 0) {
            await Promise.all(productsToUpdate.map(({ product, quantity }) =>
                CartService.updateProductQuantity(product._id, { $inc: { stock: -quantity } })
            ));

            const purchaserEmail = user;

            const productsList = cart.products.map(item => {
                return {
                    pid: item.product._id,
                    productName: item.product.title,
                    quantity: item.quantity,
                    price: item.product.price
                };
            });

            const ticket = new ticketsModel({
                code: uuidv4(),
                purchaser: purchaserEmail,
                date: Date.now(),
                amount: totalAmount,
                products: productsList
            });
            console.log("ticket:", ticket);
            console.log("totalAmount:", totalAmount);


            await ticket.save();

            cart.products = [];
            await cart.save();

            res.json({ message: 'Compra realizada con éxito', ticketId: ticket._id, cartCleared: true });
        } else {
            res.status(400).json({ message: 'Algunos productos no están disponibles', productsNotAvailable });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}