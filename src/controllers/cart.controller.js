import { CartService, ProductService } from "../repository/index.js";
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
        const cart = await CartService.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).send('Carrito no encontrado');

        let totalAmount = 0;
        const productsToUpdate = [];
        const productsNotAvailable = [];

        cart.products.forEach(item => {

            const product = item.product;

            if (product.stock < item.quantity) {

                productsNotAvailable.push({ productId: product._id, title: product.title });

            } else {

                totalAmount += product.price * item.quantity;

                productsToUpdate.push({ product, quantity: item.quantity });

            }
        });

        if (productsNotAvailable.length === 0) {

            await Promise.all(productsToUpdate.map(({ product, quantity }) =>

                ProductService.findByIdAndUpdate(product._id, { $inc: { stock: -quantity } })

            ));

            const purchaserEmail = req.user.email; 

            const ticket = new ticketsModel.create({
                code: uuidv4(),
                purchaser: purchaserEmail,
                amount: totalAmount,
            });
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