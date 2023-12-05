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


socketServer.on(`connection`, async (socket) => {

    console.log(`Se conectó el usuario`, socket.id);

    socket.emit(`productos`, await productManager.getProducts());

    socketServer.to(socket.id).emit('realTimeProductsUpdate', { products });

    socket.on('addProduct', async (data) => {

        console.log('Mensaje recibido desde el cliente:', data);
        try {
            if (data === 'productChanged') {
                const products = await productManager.consultarProductos();
                io.emit('realTimeProductsUpdate', { products });
            }
        } catch (error) {
            console.error('Error al manejar el mensaje:', error.message);
        }
    })
});