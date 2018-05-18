const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.users_get_users = function(req,res,next){
    User.find().exec()
        .then(function(result){
            res.status(200).json({ users: result });
        })
        .catch(function(error){
            res.status(500).json({ error:error });
        });
};

exports.users_signup =function(req,res,next){
    User.find({email: req.body.email}).exec()
        .then(function(user){
            if(user.length>=1){
                res.status(409).json({ message:"Email already in use" })
            }else{
                bcrypt.hash(req.body.password,10, function(error,hash){
                    if(error){
                        return res.status(500).json({ error:error });
                    }else{
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });

                        user.save()
                            .then(function(result){
                                res.status(201).json({ message:"User created" });
                            })
                            .catch(function(error){
                                res.status(500).json({ error:error });
                            });
                    }
                });
            }
        })
        .catch(function(error){
            res.status(500).json({ error:error });
        });
};

exports.users_login =function(req,res,next){
    User.find({email: req.body.email}).exec()
        .then(function(user){
            if(user.length <1){
                return res.status(401).json({message:"Auth Failed"});
            }else{
                bcrypt.compare(req.body.password,user[0].password,function(error,result){
                    if(error){
                        return res.status(401).json({message:"Auth Failed"});
                    }
                    if(result){
                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                id: user[0]._id
                            },
                            "secret",
                            {
                                expiresIn: "1h"
                            }
                        );
                        return res.status(200).json({
                            message:"Auth Success",
                            token: token
                        });
                    }else{
                        return res.status(401).json({message:"Auth Failed"});
                    }
                });
            }
        })
        .catch(function(error){
            res.status(500).json({ error:error });
        });
};

exports.users_delete_user =function(req,res,next){
    User.remove({_id: req.params.userId}).exec()
        .then(function(result){
            res.status(200).json({ message:"User deleted" });
        })
        .catch(function(error){
            res.status(500).json({ error:error });
        });
};


