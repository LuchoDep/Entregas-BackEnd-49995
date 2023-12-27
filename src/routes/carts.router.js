import { Router } from "express";
import CartManagerDb from "../dao/db/cartManagerDb.js";

const cartRouter = Router()
const manager = new CartManagerDb();

cartRouter.get('/', async (req, res) => {

	const carts = await manager.getCarts()
	res.send(carts)

});

cartRouter.get('/:cid', async (req, res) => {

	const cid = req.params.cid;

	try {
		const products = await manager.getProductsInCart(cid);
		res.json(products);
	} catch (error) {
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
	const cid = req.params.cid;
	const pid = req.params.pid;
	const stock = req.body.stock;

	try {
		const cart = await manager.addProductInCart(pid, cid, stock);

		res.status(200).json({
			status: "success",
			message: `Producto ${pid} agregado al carrito ${cid}`
		});
	} catch (error) {
		res.status(500).json({ error: 'Error al agregar el producto al carrito' });
	}
});

cartRouter.delete("/:cid", async (req, res) => {

	const cid = req.params.cid;

	try {
		const deleteCart = await manager.deleteCart(cid);

		if (deleteCart) {
			res.json({ message: `Carrito con ID ${cid} eliminado exitosamente` });
		} else {
			res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
		}
	} catch (error) {
		res.status(500).json({ error });
	}

});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
	const cid = req.params.cid;
	const pid = req.params.pid;

	try {

		if (stock <= 0) {
			return res
				.status(400)
				.json({ error: "La cantidad debe ser mayor a 0" });
		};

		const cart = await manager.getCartById(cid);
		if (!cart) {
			return res.status(404).json({ error: "No se encontró el carrito" })
		};

		const product = await manager.getProductsInCart(pid);
		if (!product) {
			return res.status(404).json({ error: "No se encontró el producto" });
		}

		await manager.deleteProductFromCart(cid, pid);
		res.json({
			message: "Producto eliminado del carrito",
			productId: pid,
			cid: cid,
		});

	} catch (error) {
		console.error("Error adding product to cart", error);
		res.status(500).json({ error: "Internal server error" });
	}
})

cartRouter.put("/:cid", async (req, res) => {
	try {
		const cid = req.params.cid;
		const updatedCartData = req.body;

		const cart = await manager.getCartById(cid);

		if (!cart) {
			return res.status(404).json({ error: "No se encontró el carrito" });
		}

		if (updatedCartData.products) {
			cart.products = updatedCartData.products;
		}
		await cart.save();

		res.json({ message: "Carrito actualizado", cart });
	} catch (error) {
		console.error("Error al actualizar el carrito:", error);
		res.status(500).json({ error });
	}
})

cartRouter.put("/:cid/products/:pid", async (req, res) => {
	const cid = req.params.cid;
	const pid = req.params.pid;
	const stock = req.body.stock;

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

	await manager.updateProductstock(cid, pid, stock);
	console.log(stock);
	res.json({
		message: "Se modificó la cantidad del producto",
		productId: pid,
		cid: cid,
	})
})



export default cartRouter;