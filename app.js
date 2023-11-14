import ProductManager from "./ProductManager.js";

const productManager = new ProductManager("./files/productos.json");

const env = async () => {

    let productos = await productManager.getProductos();

    console.log( "Listado de Productos: ", productos );

    let producto = {
        nombre: `Productazo1`,
        descripcion: `Descripcion 1`,
        precio: 12345,
        imagen: `Imagen 1`,
        codigo: `P100`,
        stock: 20,
    }

    productManager.addProducto(producto);

    const allProducts = productManager.getProductos();
    console.log('Todos los productos:', allProducts);
    
//     const productIdToUpdate = 1;
//     const updatedFields = {
//         title: 'Producto Modificado',
//         price: 150,
//     };
    
//     const updateResult = productManager.updateProducto(productIdToUpdate, updatedFields);
//     console.log('Producto actualizado:', updateResult);
}

env();