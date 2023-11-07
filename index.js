class ProductManager {
    constructor() {
        this.productos = [];
        this.productoId = 0;
    }

    addProduct(producto) {
        if (!producto.nombre || !producto.descripcion || !producto.precio || !producto.imagen || !producto.codigo || !producto.stock) {
            console.error(`Todos los campos son obligatorios`);
            return;
        }

        if (this.productos.some((p) => p.id === producto.id)) {
            console.error(`El id ya está en uso`);
            return;
        }

        this.productoId++;
        const nuevoProductos = { ...producto, id: this.productoId }
        this.productos.push(nuevoProductos);
        console.log(`Nuevo producto`, nuevoProductos)
    }

    getProductos() {
        return this.productos;
    }

    getProductosById(id) {
        const producto = this.productos.find((p) => p.id === id);
        if (!producto) {
            console.error(`No se encontró el producto`)
        }
        return producto;
    }
}

const productManager = new ProductManager();
const producto1 = {
    nombre:`Productazo1`,
    descripcion: `Descripcion 1`,
    precio: 12345,
    imagen: `Imagen 1`,
    codigo: `P100`,
    stock:20,
}

const producto2 = {
    nombre:`Productazo 2`,
    descripcion: `Descripcion 2`,
    precio: 23456,
    imagen: `Imagen 2`,
    codigo: `P101`,
    stock:20,
}

productManager.addProduct(producto1);
productManager.addProduct(producto2);

const allProducts = productManager.getProductos();
console.log (`Todos los productos:`, allProducts);

const productoIdToFind = 2;
const foundProduct = productManager.getProductosById(productoIdToFind);