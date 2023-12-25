import fs from 'fs';


class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.productId = 0;
    }

    async guardarProducts() {
        await fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.image || !product.code || !product.stock) {
            console.error(`Todos los campos son obligatorios`);
            return;
        }

        if (this.products.some((p) => p.code === product.code)) {
            console.error(`El codigo ya está en uso`);
            return;
        }

        this.productId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
        const nuevoproduct = { ...product, id: this.productId + 1 };
        this.products.push(nuevoproduct);

        await this.guardarProducts();

        console.log(`Nuevo producto`, nuevoproduct);

        return this.products;

    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const products = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
                this.products = products;
                return products;
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async getProductsById(id) {

        const products = await this.getProducts();

        let product = products.find(p => p.id == id)
        if (!product) {
            console.error(`No se encontró el producto`)
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            await this.guardarProducts();
            return true;
        }
        return false;
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.guardarProducts();
            return true;
        }
        return false;
    }
}

export default ProductManager;