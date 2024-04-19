import mongoose from "mongoose";

const documentsCollection = "documents";

const documentsSchema = new mongoose.Schema({
    identification: {
        required: true,
    },
    address: {
        required: true,
    },
    accountState: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
});

const documentsModel = mongoose.model(documentsCollection, documentsSchema);

export default documentsModel