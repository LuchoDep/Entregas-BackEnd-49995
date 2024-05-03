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
		const cart = await cartModel.findOne({ _id: cid }).populate('products.product');

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
				message: "No se pudo obtener los productos del carrito", error
			});
		}
	}

	addProductToCart = async (cid, pid, quantity) => {
		try {

			if (isNaN(quantity) || quantity <= 0) {
				throw new Error('La cantidad debe ser un número válido y mayor que cero');
			}

			const cart = await cartModel.findById(cid).populate('products.product');

			if (!cart) {
				throw new Error(`El carrito con el id ${cid} no existe`);
			}

			const product = await productModel.findById(pid);

			if (!product) {
				throw new Error(`El producto con el id ${pid} no existe`);
			}

			const productInCart = cart.products.find(item => item.product._id.equals(pid));

			if (!productInCart) {
				cart.products.push({
					product: product,
					quantity: quantity
				});
			} else {
				productInCart.quantity = quantity;
			}

			cart.total = cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0);

			await cart.save();

			return {
				status: "Success",
				msg: "Producto agregado correctamente al carrito"
			};

		} catch (error) {
			console.error('Error al intentar agregar producto al carrito:', error.message);
			throw new Error('Error al intentar agregar producto al carrito');
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

	emptyCart = async (cid) => {
		try {
			const cart = await cartModel.findOne({ _id: cid });

			if (!cart) {
				throw new Error(`Carrito con no encontrado.`);
			}

			cart.products = [];

			await cart.save();

			console.log(`Todos los productos del carrito con ID ${cid} han sido eliminados`);
			return cart;
		} catch (error) {
			console.error(`Error al eliminar todos los productos del carrito con ID ${cid}: ${error.message}`);
			throw error;
		}
	}

	updateProductQuantity = async (cid, pid, quantity) => {
		try {
			const cart = await cartModel.findById(cid);

			if (!cart) {
				throw new Error('El carrito no existe');
			}

			const productIndex = cart.products.findIndex(product => product.pid === pid);

			if (productIndex === -1) {
				throw new Error('El producto no está en el carrito');
			}

			const product = await this.productModel.getProductById(pid);

			if (!product) {
				throw new Error('El producto no existe');
			}

			if (newQuantity > product.stock) {
				throw new Error('No hay suficiente stock disponible');
			}

			cart.products[productIndex].quantity = newQuantity;

			await cart.save();

			return { status: 'success', message: 'Cantidad del producto actualizada en el carrito' };
		} catch (error) {
			return { status: 'error', message: error.message };
		}

	}

}

export default CartManagerDb;