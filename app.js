const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

//mongoDB connection
require('./config/connect');

//initialise express
const app = express();

//routes
var productsRoute = require("./api/routes/products");
var ordersRoute = require("./api/routes/orders");
var usersRoute = require("./api/routes/users");

//initial middleware
app.use(morgan("dev"));
app.use("/uploads", express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//CORS
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods","PUT, POST, PATCH, GET, DELETE");
        return res.status(200).json({});
    }
    next();
});

//middleware routes
app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/users", usersRoute);

//middleware routes for any errors
app.use("*",function(req,res,next){
    var error = new Error("File not Found");
    error.status = 404;
    next(error);
});

app.use(function(error,req,res,next){
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

module.exports = app;