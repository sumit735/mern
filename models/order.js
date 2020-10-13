const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const productsInCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number,

});
const ProductsInCart = mongoose.model("ProductCart", productsInCartSchema);

const orderSchema = new mongoose.Schema({
    products: [productsInCartSchema],
    transaction_id: {},
    amount: {
        type: Number,
        required: true
    },
    address: String,
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: '',
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Received"]
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = {
    ProductsInCart,
    Order
}