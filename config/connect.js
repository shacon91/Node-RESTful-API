const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect("mongoDB://localhost:27017/restApi");

mongoose.connection
        .once("open", function(){
            console.log("Connected to database");
        })
        .on("error",function(error){
            console.log("Connection Error");
        });