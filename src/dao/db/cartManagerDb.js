import cartModel from "../models/carts.model.js";

class CartManagerDb {
	getCarts = async () => {
		try {
			const carts = await cartModel.find();
			return carts;
		} catch (error) {
			console.log({
				status: "error",
				message: "Error al encontrar los carritos", error
			});
		}
	}

	getCartById = async (cid) => {

		const cart = await cartModel.findOne({ _id: cid });

		if (!cart) {
			console.log(`Carrito con ID ${cid} no encontrado.`);
		} else {
			return cart;
		}

	}

	createCart = async () => {
		try {
			const cart = await cartModel.create();
			return cart;
		} catch (error) {
			console.log({
				status: "error",
				message: "No se pudo crear el carrito", error
			});
		}
	}

	getProductsInCart = async (cid) => {
		try {
			const cart = await cartModel.findOne({ _id: cid });

			if (!cart) {
				throw new Error(`Carrito con ID ${cid} no encontrado.`);
			}

			return cart.products;
		} catch (error) {
			console.log({
				status: "error",
				message: "No se pudo obtener los produtos del carrito", error
			});
		}
	}

	addProductInCart = async (cid, pid, quantity) => {
		const cart = await cartsModel.findOne({ _id: cid });
		if (!cart) {
			return {
				status: "error",
				message: `El carrito con el id ${cid} no existe`
			}
		};
		const product = await productsModel.findOne({ _id: pid });
		if (!product) {
			return {
				status: "error",
				message: `El producto con el id ${pid} no existe`
			}
		};
		let productsInCart = cart.product;

		const indexProduct = productsInCart.findIndex((product) => product.product == pid);

		if (indexProduct == -1) {
			const newProduct = {
				product: pid,
				quantity: quantity
			}
			cart.product.push(newProduct);
		} else {
			cart.product[indexProduct].quantity += quantity;
		}

		await cart.save();

		return cart;

	}

	deleteCart = async (cid) => {
		try {
			const result = await cartModel.deleteOne({ _id: cid });

			if (result.deletedCount > 0) {
				console.log(`Carrito con ID ${cid} eliminado exitosamente`);
				return true;
			} else {
				console.log({
					status: "error",
					message: "No se pudo eli el carrito", error
				});
			}
		} catch (error) {
			console.error(`Error al eliminar el carrito con ID ${cartId}: ${error.message}`);
		}
	}


	deleteProductFromCart = async (cid, pid) => {
		try {
			const cart = await cartModel.findOne({ _id: cid });

			if (!cart) {
				return {
					status: "error",
					message: `El carrito con el ID ${cid} no existe`
				};
			}

			cart.products = cart.products.filter(product => product.product !== pid);

			await cart.save();

			return {
				status: "success",
				message: `Producto con el ID ${pid} eliminado del carrito.`
			};
		} catch (error) {
			console.error(`Error al eliminar el producto del carrito: ${error}`);
			return {
				status: "error",
				message: "Error al eliminar el producto del carrito",
				error: error
			};
		}
	}

	updateProductQuantity = async (cid, pid, quantity) => {
		try {
			const cart = await cartModel.findOne({ _id: cid });

			if (!cart) {
				return {
					status: "error",
					message: `El carrito con el ID ${cid} no existe`
				};
			}

			const productToUpdate = cart.products.find(product => product.product === pid);

			if (!productToUpdate) {
				return {
					status: "error",
					message: `El producto con el ID ${pid} no existe en el carrito`
				};
			}

			productToUpdate.quantity = quantity;
			await cart.save();

			return {
				status: "success",
				message: `Cantidad del producto con el ID ${pid} actualizada en el carrito con el ID ${cid}`
			};
		} catch (error) {
			console.error(`Error al actualizar la cantidad del producto en el carrito: ${error}`);
			return {
				status: "error",
				message: "Error al actualizar la cantidad del producto en el carrito",
				error: error
			};
		}
	}

}

export default CartManagerDb;