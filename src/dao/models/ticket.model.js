import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({

    code:{
        type:String,
        required:true,
        unique:true
    },
    purchase_datetime: Date,
    amount:Number,
    purchaser:{
        type:String,
        required:true
    }

});

export const ticketsModel = mongoose.model(ticketCollection, ticketSchema);
