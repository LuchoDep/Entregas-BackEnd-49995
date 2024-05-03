import mongoose from "mongoose";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({

	code: {
		type: String,
		required: true,
		unique: true
	},
	purchase_datetime: Date,
	purchaser: {
		type: String,
		required: true
	},
	amount: Number,
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'products',
				required: true,
			},
			quantity: {
				type: Number,
				default: 1,
			},
		},
	],

});

ticketSchema.pre("find", function () {
	this.populate("products.product");
});

ticketSchema.index({ 'products.quantity': 1 });

export const ticketsModel = mongoose.model(ticketCollection, ticketSchema);
