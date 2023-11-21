import express from "express";
import ProductManager from "./src/ProductManager.js";

const productManager = new ProductManager("./files/productos.json");
const PORT = 8080;
const app = express();

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/products', async (req, res) => {
    const limit = req.query.limit;

    try {
        const productos = await productManager.getProductos();
        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error obteniendo productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid;

    try {
        const producto = await productManager.getProductosById(parseInt(pid));
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ error: 'Error obteniendo producto' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor abierto en el puerto ${8080}`);
});


let productos = await productManager.getProductos();

const producto1 = {
    nombre: `Productazo1`,
    descripcion: `Descripcion 1`,
    precio: 12345,
    imagen: `Imagen 1`,
    codigo: `P100`,
    stock: 20,
}

const producto2 = {
    nombre: `Productazo 2`,
    descripcion: `Descripcion 2`,
    precio: 23456,
    imagen: `Imagen 2`,
    codigo: `P101`,
    stock: 20,
}
const producto3 = {
    nombre: `Productazo3`,
    descripcion: `Descripcion 2`,
    precio: 12345,
    imagen: `Imagen 1`,
    codigo: `P102`,
    stock: 20,
}
const producto4 = {
    nombre: `Productazo4`,
    descripcion: `Descripcion 4`,
    precio: 12345,
    imagen: `Imagen 1`,
    codigo: `P103`,
    stock: 20,
}
const producto5 = {
    nombre: `Productazo5`,
    descripcion: `Descripcion 5`,
    precio: 12345,
    imagen: `Imagen 1`,
    codigo: `P104`,
    stock: 20,
}

await productManager.addProducto(producto1);
await productManager.addProducto(producto2);
await productManager.addProducto(producto3);
await productManager.addProducto(producto4);
await productManager.addProducto(producto5);


// const env = async () => {


//     let productos = await productManager.getProductos();

//     console.log("Listado de Productos: ", productos);

//     let producto = {
//         nombre: `Productazo1`,
//         descripcion: `Descripcion 1`,
//         precio: 12345,
//         imagen: `Imagen 1`,
//         codigo: `P100`,
//         stock: 20,
//     }

//     let producto2 = {
//         nombre: `Productazo2`,
//         descripcion: `Descripcion 2`,
//         precio: 12345,
//         imagen: `Imagen 1`,
//         codigo: `P101`,
//         stock: 20,
//     }

//     await productManager.addProducto(producto);
//     await productManager.addProducto(producto2);


//     const allProducts = await productManager.getProductos();
//     // console.log('Todos los productos:', allProducts);

//     // const productIdToUpdate = 1;
//     // const updatedFields = {
//     //     nombre: 'Producto Modificado',
//     //     precio: 150,
//     // };

//     // const updateResult = await productManager.updateProducto(productIdToUpdate, updatedFields);
//     // console.log('Producto actualizado:', updateResult);


//     // await productManager.deleteProducto(1);
// }
// env();