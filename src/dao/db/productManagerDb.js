import productModel from "../models/product.model.js";

class ProductManagerDB {

	async getProducts(limit, page, sort, category, availability, query) {

		const filter = {};
		if (category) {
			filter.category = category;
		}
		if (availability) {
			filter.stock = { $gt: 0 };
		}
		if (query) {
			filter.$or = [
				{ title: { $regex: new RegExp(query, 'i') } },
			];
		}

		const options = {
			limit: limit ? parseInt(limit, 10) : 5,
			page: page !== undefined ? parseInt(page, 10) : 1,
			sort: { price: sort === "asc" ? 1 : -1 },
			lean: true
		};

		const products = await productModel.paginate(filter, options);

		const queryParamsForPagination = {
			limit: options.limit,
			page: options.page,
			sort,
			category,
			availability,
			query
		};

		Object.keys(queryParamsForPagination).forEach(
			key => queryParamsForPagination[key] === undefined && delete queryParamsForPagination[key]
		);

		const baseLink = '/products';
		const prevLink = products.hasPrevPage
			? `${baseLink}?${new URLSearchParams({ ...queryParamsForPagination, page: options.page - 1 }).toString()}`
			: null;

		const nextLink = products.hasNextPage
			? `${baseLink}?${new URLSearchParams({ ...queryParamsForPagination, page: options.page + 1 }).toString()}`
			: null;

		return {
			status: "success",
			msg: {
				...products,
				prevLink,
				nextLink
			}
		};
	};

	async createProduct(product) {
		const newProduct = await productModel.create(product)
		return newProduct
	};

	async getProductById(pid) {
		try {
			const product = await productModel.findOne({ _id: pid });
			// console.log("producto del manager:", product);
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
			const result = await productModel.deleteOne({ pid });

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
			const result = await productModel.updateOne({ pid }, { $set: updatedProduct });
			if (result.modifDocs > 0) {
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