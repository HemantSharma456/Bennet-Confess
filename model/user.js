const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://hemantsh00456:jH9n0XZNq1vj2uvl@cluster0.drv1mnr.mongodb.net/confessApp?retryWrites=true&w=majority&appName=Cluster0");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]
})

module.exports = mongoose.model("user" , userSchema);