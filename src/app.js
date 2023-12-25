import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import __dirname from "./utils.js"
import ProductManager from "./dao/filesystem/ProductManager.js";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Servidor abierto en el puerto ${8080}`));
const socketServer = new Server(httpServer);

const productManager = new ProductManager(__dirname + "/dao/db/filesystem/files/productos.json");

const MONGO = "mongodb+srv://luchodepetris727:ywsj4LY2H1eGEjOu@cluster0.45guaro.mongodb.net/ecommerce";
const connection = mongoose.connect(MONGO);


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

    try {

        console.log("Nuevo cliente conectado con ID:", socket.id);

        socket.on('sendMessage', async (data) => {

            try {
                const newMessage = await messageModel.create({ user: data.user, message: data.message });
                console.log('Nuevo mensaje guardado en la base de datos:', newMessage);

                io.emit('newMessage', { user: data.user, message: data.message });
            } catch (error) {
                console.error('Error al guardar el mensaje en la base de datos:', error.message);
            }
        });

    } catch (error) {
        console.error('Error en la conexión de socket:', error.message);
    }

    socket.on('addProduct', async (productData) => {
        try {
            console.log('Datos del producto recibidos en el servidor:', productData);

            await productManager.getProducts();
            await productManager.addProduct(productData.title, productData.description, productData.price, productData.image, productData.code, productData.stock);
            // await productManager.addProduct({});

            socketServer.emit('newProduct', productData);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });
});