import productModel from "../models/product.model.js";

class ProductManagerDB {

	async getProducts() {

		const products = await productModel.find();

		return products;
	}

	async addProduct(
		title,
		description,
		price,
		thumbnail,
		code,
		stock,
		status,
		category
	) {
		const newProduct = {
			title,
			description,
			price,
			thumbnail,
			code,
			stock,
			status,
			category,
		};
		try {

			const repeatCode = await productModel.find({ code: newProduct.code });
			if (repeatCode) {
				throw new Error("El código está repetido");
			}
			const products = await productModel.create(newProduct);
			return products;

		} catch (error) {
			throw new Error(`No se pudo crear el producto: ${error.message}`);
		}
	}

	async getProductById(pid) {
		try {
			const product = await productModel.findById(pid);
			if (!product) {
				throw new Error(`No se encontró el producto con ID ${pid}`);
			}
			return product;
		} catch (error) {
			throw new Error(`No se pudo encontrar el producto: ${error.message}`);
		}
	}

	async deleteProduct(pid) {
		try {
			const result = await productModel.deleteOne({ _id: pid });
			if (result.deletedCount > 0) {
				console.log(`Producto con ID ${pid} eliminado exitosamente`);
			} else {
				console.log(`No se encontró el producto con ID ${pid}`);
			}
		} catch (error) {
			throw new Error(`No se pudo eliminar el producto: ${error.message}`);
		}
	}

	async updateProduct(pid, updatedProduct) {
		try {
			const result = await productModel.updateOne({ _id: pid }, { $set: updatedProduct });
			if (result.nModified > 0) {
				console.log(`Producto con ID ${pid} actualizado`);
			} else {
				console.log(`No se encontró el producto con ID ${pid}`);
			}
		} catch (error) {
			throw new Error(`No se pudo modificar el producto: ${error.message}`);
		}
	}
};

export default ProductManagerDB;