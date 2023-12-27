import mongoose from "mongoose";

const collection = "carts";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                require: true
            }
        },
    ],
});

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;