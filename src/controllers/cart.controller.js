import { CartService, ProductService } from "../repository";
import { ticketsModel } from "../dao/models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export const getCarts = async (req, res) => {

    try {

        const carts = await CartService.getCarts();
        res.send({ status: "success", payload: carts });

    } catch (error) {
        res.send({ status: "error", message: error.message });

    }
};

export const getCartById = async (req, res) => {

    try {

        const cartId = req.params.cid;

        const cart = await CartService.findOne({ cartId });

        res.send({ status: "success", payload: cart });

    } catch (error) {
        res.send({ status: "error", message: error.message });
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
        res.send({ status: "error", message: error.message });
    }

};

export const addProductToCart = async (req, res) => {

    try {

        const cart = await CartService.findOne({ _id: req.params.cid });

        const oldProduct = cart.products.find(
            ({ product }) => product.toString() === req.params.pid
        );

        if (oldProduct) {

            oldProduct.quantity += 1;

        } else {

            cart.products.push({

                product: req.params.pid,
                quantity: 1,

            });
        }

        const update = await CartService.updateOne({ _id: req.params.cid }, cart);

        res.send(update);


    } catch (error) {
        res.send({ status: "error", message: error.message });
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
        res.send({ status: "error", message: error.message });
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
        res.send({ status: "error", message: error.message });
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
        const quantity = req.body.quantity;

        await manager.updateProductQuantity(cid, pid, quantity);

        res.json({

            message: "Se modificó la cantidad del producto",
            productId: pid,
            cid: cid,
        });


    } catch (error) {
        res.send({ status: "error", message: error.message });
    }

};

export const buyCart = async (req, res) => {

    try {

        const cartId = req.params.cid;
        const cart = await CartService.getCartByID(cartId);

        if (cart) {

            if (!cart.products.length) {

                return res.send("")

            }
            const ticketProducts = [];

            const rejectedProducts = [];

            for (let i = 0; i < cart.products.length; i++) {

                const cartProduct = cart.products[i];

                const productDB = await ProductService.getProductByID(cartProduct.product._id);

                if (!productDB) {

                    return res.status(404).json({

                        message: 'No se encontro el producto'

                    })

                }

                if (cartProduct.quantity <= productDB.stock) {

                    ticketProducts.push(cartProduct);

                } else {

                    rejectedProducts.push(cartProduct);

                }
            }

            const newTicket = {
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: 500,
                purchaser: 'email@email.com'
            }

            const ticketCreated = await ticketsModel.create(newTicket);

            res.send(ticketCreated)
        } else {

            res.send("el carrito no existe")

        }
    } catch (error) {

        res.send(error.message)
    }
}