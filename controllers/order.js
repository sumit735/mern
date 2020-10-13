const { ProductsInCart, Order } = require('../models/order');

const getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate('products.product', 'name price')
        .exec((err, order) => {
            if(err) {
                return res.status(400).json({
                    error: "No Order Found in DB"
                });
            }

            req.order = order;
            next();
        });
}

const createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, order) => {
        if(err) {
            return res.status(400).json({
                error: "Failed to Create an Order"
            });
        }

        res.json(order);
    })
}

const getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name email")
        .exec((err, orders) => {
            if(err) {
                return res.status(400).json({
                    error: "No Orders Found"
                });
            }

            res.json(orders);
        })
}

const getOrderStatus = (req, res) => {
    res.json(Order.schema.path('status').enumValues);
}

const updateStatus = (req, res) => {
    Order.update(
        {_id: req.body.order._id},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err) {
                return res.status(400).json({
                    error: "Couldn't update order status"
                });
            }

            res.json(order);
        }
    )
}



module.exports = {
    getOrderById,
    createOrder,
    getAllOrders,
    updateStatus,
    getOrderStatus
}