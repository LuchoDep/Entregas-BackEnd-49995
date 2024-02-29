export class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getProducts() {
        try {
            const result = await this.dao.getProducts();
            const products = result;
            return products
        } catch (error) {
            console.log(error);
        }
    }

    async getProductByID(pid) {
        try {
            const result = await this.dao.getProductByID(pid);
            return result
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async createProduct(productData) {
        try {
            const result = await this.dao.createProduct(productData);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async updateProduct(pid, update) {
        try {
            const result = await this.dao.updateProduct(pid, update);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }

    async deleteProduct(pid) {
        try {
            const result = await this.dao.deleteProduct(pid);
            return result;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }
}