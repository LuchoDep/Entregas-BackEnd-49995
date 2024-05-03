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
                required: true
            }
        },
    ],
});

cartSchema.pre("find", function(next) {
    console.log("Antes de populate:", this);
    this.populate("products.product");
    console.log("Después de populate:", this);
    next();
  });

cartSchema.index({ 'products.quantity': 1 });

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;