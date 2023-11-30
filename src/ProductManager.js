import fs from 'fs';


class ProductManager {
    constructor(path) {
        this.path = path;
        this.productos = [];
        this.productoId = 0;
    }

    async guardarProductos() {
        await fs.writeFileSync(this.path, JSON.stringify(this.productos, null, 2), 'utf-8');
    }

    async addProducto(producto) {
        if (!producto.nombre || !producto.descripcion || !producto.precio || !producto.imagen || !producto.codigo || !producto.stock) {
            console.error(`Todos los campos son obligatorios`);
            return;
        }

        if (this.productos.some((p) => p.codigo === producto.codigo)) {
            console.error(`El id ya está en uso`);
            return;
        }

        this.productoId = this.productos.length > 0 ? this.productos[this.productos.length - 1].id : 0;
        const nuevoProducto = { ...producto, id: this.productoId + 1 };
        this.productos.push(nuevoProducto);

        await this.guardarProductos();

        console.log(`Nuevo producto`, nuevoProducto);

        return this.productos;

    }

    async getProductos() {
        try {
            if (fs.existsSync(this.path)) {
                const productos = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
                this.productos = productos;
                return productos;
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async getProductosById(id) {

        const productos = await this.getProductos();

        let producto = productos.find(p => p.id == id)
        if (!producto) {
            console.error(`No se encontró el producto`)
        }
        return producto;
    }

    async updateProducto(id, updatedFields) {
        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.productos[index] = { ...this.productos[index], ...updatedFields };
            await this.guardarProductos();
            return true;
        }
        return false;
    }

    async deleteProducto(id) {
        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            this.productos.splice(index, 1);
            await this.guardarProductos();
            return true;
        }
        return false;
    }
}

export default ProductManager;