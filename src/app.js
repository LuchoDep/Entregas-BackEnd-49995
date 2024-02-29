import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import inicializePassport from "./config/passport.config.js";
import __dirname from "./utils.js"

import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import sessionRouter from "./routes/sessions.routes.js"
import viewsRouter from "./routes/views.routes.js";
import messageModel from "./dao/models/message.model.js";
import { ProductService } from "./repository/index.js"
import { options } from "./config/options.config.js";
import { connectDB } from "./config/connectDb.config.js";


const app = express();
const PORT = options.server.port;
const httpServer = app.listen(PORT, () => console.log(`Servidor abierto en el puerto ${8080}`));
const socketServer = new Server(httpServer);

connectDB();

app.engine("handlebars", handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    store: new MongoStore({
        mongoUrl: options.mongo.url,
    }),
    secret: "CoderSecret",
    resave: false,
    saveUninitialized: false
}));

inicializePassport()
app.use(passport.initialize());
app.use(passport.session());

app.use(`/`, viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use('/api/sessions', sessionRouter);

socketServer.on("connection", (socket) => {

    socket.on('addProduct', async (productData) => {
        try {
            console.log('Datos del producto recibidos en el servidor:', productData);

            await ProductService.getProducts();
            await ProductService.addProduct({});

            socketServer.emit('newProduct', productData);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });

    socket.on('message', async (data) => {
        try {
            const nuevoMensaje = await messageModel.create(data);

            if (!nuevoMensaje) {
                throw new Error('No se pudo crear el mensaje');
            }

            const datosNuevoMensaje = await messageModel.findById(nuevoMensaje._id).lean();

            if (!datosNuevoMensaje) {
                throw new Error('No se encontró el mensaje recién creado');
            }

            socketServer.emit('newMessage', datosNuevoMensaje);
        } catch (error) {
            console.error("Se produjo un error al procesar el mensaje:", error);
        }
    });

});