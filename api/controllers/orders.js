const mongoose = require('mongoose');

const Order = require('../models/orders');
const Product = require('../models/products');

exports.orders_get_all = function(req,res,next){
    Order.find()
        .populate('productId', 'name price')
        .exec()
        .then(function(results){
            if(results) {
                res.status(200).json({
                    message: "orders fetched",
                    count: results.length,
                    orders: results.map(function (result) {
                        return {
                            orderId: result._id,
                            productId: result.productId,
                            quantity: result.quantity,
                            request: {
                                type: "GET",
                                url: "http://localhost:8000/orders/"+result._id
                            }
                        }
                    })
                });
            }else{
                res.status(404).json({ message:"No orders found" })
            }
        })
        .catch(function(error){
            res.status(500).json({ error:error })
        });
};

exports.orders_create_order = function(req,res,next){
    var productId = req.body.productId;
    Product.findById({_id:productId}).exec()
        .then(function(product){
            if(product){
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    productId: productId,
                    quantity: req.body.quantity
                });

                return order.save();
            }else{
                res.status(404).json({
                    message: "Product not found"
                })
            }
        })
        .then(function(result){
            res.status(201).json({
                message: "order posted",
                createdOrder: result,
                request: {
                    type: "GET",
                    url: "http://localhost:8000/orders/"+result._id
                }
            })
        })
        .catch(function(error){
            res.status(500).json({
                error:error
            })
        });
};

exports.orders_get_a_order = function(req,res,next){
    var id = req.params.orderId;
    Order.findById(id)
        .populate('productId')
        .exec()
        .then(function(order){
            if(order){
                res.status(200).json({
                    order: order,
                    request: {
                        type: "GET",
                        url: "http://localhost:8000/orders/"
                    }
                });
            }else{
                res.status(404).json({ message:"No order for that id" })
            }

        })
        .catch(function(error){
            res.status(500).json({ error:error })
        });
};

exports.orders_delete_order = function(req,res,next){
    var id = req.params.orderId;
    Order.remove({_id:id})
        .exec()
        .then(function(result){
            res.status(200).json({
                message:"Order deleted"
            })
        })
        .catch(function(error){
            res.status(500).json({ error:error })
        });

};