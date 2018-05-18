const mongoose = require('mongoose');

const Product = require('../models/products');

exports.products_get_products = function(req,res,next){
    Product.find()
        .select("_id name price productImage")
        .exec()
        .then(function(docs){
            if(docs){
                const response = {
                    count: docs.length,
                    products: docs.map(function(doc) {
                        return {
                            _id: doc._id,
                            name: doc.name,
                            price: doc.price,
                            productImage: doc.productImage,
                            request: {
                                type: "GET",
                                url: "http://localhost:8000/products/" + doc._id
                            }
                        }
                    })
                };
                res.status(200).json(response);
            }else{
                res.status(404).json({message: "No products found"});
            }
        })
        .catch(function(error){
            res.status(500).json({error: error});
        });

};

exports.products_create_product = function(req,res,next){
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
        .then(function(result){
            console.log(result);
            res.status(201).json({
                message: "product posted",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: "GET",
                        url: "http://localhost:8000/products/" + result._id
                    }
                }
            })
        })
        .catch(function(error){
            console.log(error);
            res.status(500).json({error: error});
        });
};

exports.products_get_a_product = function(req,res,next){
    var id = req.params.productId;
    Product.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(function(result){
            console.log(result);
            if(result){
                res.status(200).json({
                    product: result,
                    description: "Get all products",
                    request:{
                        type: "GET",
                        url: "http://localhost:8000/products"
                    }
                });
            }else{
                res.status(404).json({
                    message: "No Valid entry found"
                });
            }

        })
        .catch(function(error){
            console.log(error);
            res.status(500).json({error: error});
        });

};

exports.products_update_a_product = function(req,res,next){
    var id = req.params.productId;
    const updateOps = {
        name: req.body.name,
        price: req.body.price
    };

    console.log(updateOps);
    Product.update({_id: id}, {$set: updateOps}).exec()
        .then(function(result){
            console.log(result);
            res.status(200).json({
                message: "Product Updated",
                request:{
                    type: "GET",
                    url: "http://localhost:8000/products/"+id
                }});
        })
        .catch(function(error){
            console.log(error);
            res.status(500).json({error: error});
        });
};

exports.products_delete_a_product = function(req,res,next){
    var id = req.params.productId;
    Product.remove({_id: id}).exec()
        .then(function(result){
            res.status(200).json({
                message: "Product Deleted",
                request:{
                    type: "GET",
                    url: "http://localhost:8000/products"
                }})
        })
        .catch(function(error){
            res.status(500).json({error: error})
        });

};