import cartModel from "../models/carts.model.js";
import productModel from "../models/product.model.js";

class CartManagerDb {

	getCarts = async () => {

		try {
			const carts = await cartModel.find();
			return carts;
		} catch (error) {
			throw new Error("Error al encontrar los carritos: " + error.message);
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
			const cart = await cartModel.create({});
			return {
				status: "success",
				message: "Carrito creado correctamente",
				cart: cart
			};
		} catch (error) {
			return {
				status: "error",
				message: "No se pudo crear el carrito",
				error: error.message
			};
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
		try {
			const cart = await cartModel.findById(cid);
			if (!cart) {
				throw new Error(`El carrito con el ID ${cid} no existe`);
			}
	
			const product = await productModel.findById(pid);

			if (!product) {
				throw new Error(`El producto con el ID ${pid} no existe`);
			}
	
			const productExistsInCart = cart.products.some(prod => prod.product === pid);

			if (!productExistsInCart) {
				const newProduct = {
					product: pid,
					quantity: quantity
				};
				cart.products.push(newProduct);
			} else {
				const existingProduct = cart.products.find(prod => prod.product === pid);
				existingProduct.quantity += quantity;
	
				if (existingProduct.quantity <= 0) {
					cart.products = cart.products.filter(prod => prod.product !== pid);
				}
			}
	
			await cart.save();
			return cart;
		} catch (error) {
			throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
		}
	}

	deleteCart = async (cid) => {
		try {
			const result = await cartModel.deleteOne({ _id: cid });

			if (result.deletedCount === 0) {
				throw new Error(`Carrito con ID ${cid} no encontrado`);
			}

			console.log(`Carrito con ID ${cid} eliminado exitosamente`);
			return true;
		} catch (error) {
			throw new Error(`Error al eliminar el carrito con ID ${cid}: ${error.message}`);
		}
	}


	deleteProductFromCart = async (cid, pid) => {
		try {
			const cart = await cartModel.findOne({ _id: cid });

			if (!cart) {
				throw new Error(`El carrito con el ID ${cid} no existe`);
			}

			cart.products = cart.products.filter(product => product.product.toString() !== pid.toString());

			await cart.save();
			return {
				status: "success",
				message: `Producto con el ID ${pid} eliminado del carrito.`
			};
		} catch (error) {
			throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
		}
	}

	updateProductQuantity = async (cid, pid, quantity) => {

		try {

			const cart = await cartModel.findById(cid);

			if (!cart) {

				throw new Error(`El carrito con el ID ${cid} no existe`);
			}
	
			const productIndex = cart.products.findIndex(prod => prod.product.toString() === pid);

			if (productIndex === -1) {

				throw new Error(`El producto con el ID ${pid} no está en el carrito`);
			}
	
			cart.products[productIndex].quantity = quantity;

			if (quantity <= 0) {

				cart.products.splice(productIndex, 1);
			}
	
			await cart.save();

			return cart;

		} catch (error) {

			throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
			
		}
	}

}

export default CartManagerDb;