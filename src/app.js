import express from "express";
import ProductManager from "./ProductManager.js";
import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/carts.router.js"

const productManager = new ProductManager("./files/productos.json");
const PORT = 8080;
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)


app.listen(PORT, () => {
    console.log(`Servidor abierto en el puerto ${8080}`);
});
