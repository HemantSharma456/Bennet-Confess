const express = require("express");
const router = express.Router();
const bcrypt = requre("bcrypt");
const userModel = require("../model/user");

router.use(express.json());
app.use(express.urlencoded({extended:false}));

router.post("/register" , async(req,res)=>{
    const{name,username,email,password} = req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("User already registered");
    
    bcrypt.gen

});

router.post("/login" , async(req,res)=>{
    const{email , password} = req.body;
    let user = await userModel.find({email:email , password:password});

})

module.exports = router;