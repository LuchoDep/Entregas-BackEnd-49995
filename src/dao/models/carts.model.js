import mongoose from "mongoose";

const collection = "carts";

const cartSchema = new mongoose.Schema( {
    products: [
    {
        quantity: { type: Number, },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" }
    },
],
});

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;