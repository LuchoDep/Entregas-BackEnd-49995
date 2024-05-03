import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema({

    first_name: String,
    last_name: String,
    email:String,
    age:Number,
    password:String,
    role: {
        type: String,
        required:true,
        enum:["user", "premium","admin"],
        default: 'user',
    },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
    documents: [
        {
          name: {
            type: String,
          },
          reference: {
            type: String,
          },
        },
    ],
    last_connection: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model(collection,schema);

export default userModel;