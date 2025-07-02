const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    date:{
        type:Date,
        default:Date.now
    },
    content: {
        type: String
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    isPublic:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("post" , postSchema);