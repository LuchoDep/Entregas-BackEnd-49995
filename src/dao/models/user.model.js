import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema({

    first_name: String,
    last_name: String,
    email:String,
    age:Number,
    password:String,
    rol: {
        type: String,
        required:true,
        enum:["user","admin"],
        default: 'user',
    },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }
});

const userModel = mongoose.model(collection,schema);

export default userModel;