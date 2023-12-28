import { Router } from "express";
import CartManagerDb from "../dao/db/cartManagerDb.js";
import cartModel from "../dao/models/carts.model.js";
import ProductManagerDb from "../dao/db/productManagerDb.js";

const cartRouter = Router()
const manager = new CartManagerDb();
const productManager = new ProductManagerDb();

cartRouter.get('/', async (req, res) => {

	const carts = await manager.getCarts()

	res.send(carts)

});

cartRouter.get('/:cid', async (req, res) => {

	try {

		const cart = await cartModel
		.findOne({ _id: req.params.cid })
		.populate('products.product')
		.lean();

	console.log(cart);

	// res.render('cart', { cart });

	return cart;

	} catch (error) {

		console.error("Error al encontrar el carrito:", error);

		res.status(500).json({ error });
	}

});


cartRouter.post("/", async (req, res) => {

	try {

		const cart = await manager.createCart()

		res.status(201).json({ message: "Carrito creado", cart });

	} catch (error) {

		console.error("Error al crear carrito", error);
		
		res.status(500).json({ error });
	}

});

cartRouter.post('/:cid/product/:pid', async (req, res) => {

	const cart = await cartModel.findOne({ _id: req.params.cid });

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

	const update = await cartModel.updateOne({ _id: req.params.cid }, cart);

	res.send(update);
});

cartRouter.delete("/:cid", async (req, res) => {

	const cid = req.params.cid;

	try {

		const deleteCart = await manager.deleteCart(cid);

		if (deleteCart) {

			res.json({ message: `El carrito de ID ${cid} fue eliminado` });

		} else {

			res.status(404).json({ error: `El carrito de ID ${cid} no se encontró` });

		}
	} catch (error) {

		res.status(500).json({ error });

	}

});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {

        const cart = await manager.getCartById(cid);

        if (!cart) {

            return res.status(404).json({ error: "No se encontró el carrito" });

        }

        if (cart.quantity <= 0) {

            return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });

        }

        await manager.deleteProductFromCart(cid, pid);

        res.json({
            message: "Producto eliminado del carrito",
            pid: pid,
            cid: cid,
        });

    } catch (error) {

        console.error("Error al eliminar producto del carrito", error);

        res.status(500).json({ error: "Internal server error" });
		
    }
});

cartRouter.put("/:cid", async (req, res) => {

    try {

        const cid = req.params.cid;
        const updatedCartData = req.body;

        const cart = await manager.getCartById(cid);

        if (!cart) {

            return res.status(404).json({ error: "No se encontró el carrito" });
        }

        if (updatedCartData.products) {

            cart.products = [...cart.products, ...updatedCartData.products];
        }

        await cart.save();

        res.json({ message: "Carrito actualizado", cart });

    } catch (error) {

        console.error("Error al actualizar el carrito:", error);

        res.status(500).json({ error });
    }
});



cartRouter.put("/:cid/product/:pid", async (req, res) => {
	const cid = req.params.cid;
	const pid = req.params.pid;
	const quantity = req.body.quantity;

	const cart = await manager.getCartById(cid);
	console.log("Cart:", cart);

	if (!cart) {
		return res.status(404).json({ error: "Cart not found" });
	}
	console.log(cart);

	const product = await productManager.getProductById(pid);
	if (!product) {
		return res.status(404).json({ error: "Product not found" });
	}
	console.log();

	await manager.addProductInCart(cid, pid, quantity);
	console.log(quantity);
	res.json({
		message: "Se modificó la cantidad del producto",
		productId: pid,
		cid: cid,
	})
})

cartRouter.put("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    try {

        await manager.updateProductQuantity(cid, pid, quantity);

        res.json({

            message: "Se modificó la cantidad del producto",
            productId: pid,
            cid: cid,
        });

    } catch (error) {

        console.error("Error al actualizar la cantidad del producto en el carrito", error);

        res.status(500).json({ error: "Internal server error" });

    }
});


export default cartRouter;