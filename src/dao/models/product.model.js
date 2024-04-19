import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        index: true,
    },
    price: {
        type: Number,
        required: true,
        index: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    owner: {
        type: String,
        required: true
    }
});

productSchema.plugin(mongoosePaginate);
productSchema.index({ title: 'text', description: 'text', category: 'text' });

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;