import productModel from "../models/product.model.js";

class ProductManagerDB {

	async getProducts() {
		const products = await productModel.find();
		console.log(products);
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
		const repeatCode = await productModel.find({ code: newProduct.code });
		if (repeatCode.length > 0) {
			console.log("El codigo está repetido");
			return;
		}
		try {
			const products = await productModel.create(newProduct);
			return products;
		} catch (error) {
			console.log({
				status: "error",
				message: "No se pudo crear el producto", error
			});
		}
	}

	async getProductById(id) {
		try { 
			const product = await productModel.findOne({ _id:id });
			console.log(`Producto con ID ${id}:`, product);

			return product;
		} catch (error) {
			console.log({
				status: "error",
				message: "No se pudo encontrar el producto", error
			});
		}
	}

	async deleteProduct(id) {
		try {
			const result = await productModel.deleteOne({ _id:id });

			if (result.deletedCount > 0) {
				console.log(`Producto con ID ${id} eliminado.`);
			} else {
				console.log(`No se encontró el producto con ID ${id}.`);
			}
		} catch (error) {
			console.log({
				status: "failed",
				message: "No se pudo eliminar el producto", error
			});
		}
	}

	async updateProduct(id, updatedProduct) {
		try {
			const result = await productModel.updateOne({ _id:id }, { $set: updatedProduct });

			if (result.nModified > 0) {
				console.log(`Producto con ID ${id} actualizado.`);
			} else {
				console.log(`No se encontró el producto con el ID ${id}.`);
			}
		} catch (error) {
			console.log({
				status: "failed",
				message: "No se pudo modificar el producto", error
			});
		}
	}
};

export default ProductManagerDB;