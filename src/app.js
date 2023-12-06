import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js"
import ProductManager from "./ProductManager.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const productManager = new ProductManager("./files/productos.json");


const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Servidor abierto en el puerto ${8080}`));
const socketServer = new Server(httpServer);


app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(`/`, viewsRouter);
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)


socketServer.on("connection", (socket) => {

    console.log("Nuevo cliente conectado con ID:", socket.id);

    socket.on('addProduct', async (productData) => {
        try {
            console.log('Datos del producto recibidos en el servidor:', productData);

            await productManager.getProducts();
            await productManager.addProduct(productData.nombre, productData.descripcion, productData.precio, productData.imagen, productData.codigo, productData.stock);

            socketServer.emit('newProduct', productData);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });
});