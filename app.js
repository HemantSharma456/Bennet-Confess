const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const userModel = require("./model/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const path = require("path");
const postModel = require("./model/post");
const { log } = require("console");
require("dotenv").config();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/" , (req,res)=>{
    res.render("index");
});


//Register Model
app.post("/register" , async(req,res)=>{
    const{name,username,email,password} = req.body;
    if(!req.body.name ||!req.body.username || !req.body.email || !req.body.password ) res.send("empty field");
    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("User Already exist");
    
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            const user = await userModel.create({
                username,
                name,
                password:hash,
                email
            });

            let token = jwt.sign({email:email , userId:user._id} , "secretKey");
            res.cookie("token" , token);
            res.redirect("/confession");
        })
    })
    
});

app.get("/confession" , isLoggedIn, async(req,res)=>{
        let user = await userModel.findOne({email:req.user.email});
        let publicPosts = await postModel.find({ isPublic: true })
        .populate("user");
        res.render("confession" , {user,publicPosts});
})

//Login Model
app.post("/login" , async(req,res)=>{
    const{email,password} = req.body;
    let user = await userModel.findOne({email : email});
    if(!user) return res.status(500).send("Something went wrong");
    bcrypt.compare(password, user.password, (err,result)=>{
        if(result){
            let token = jwt.sign({email:email , userId:user._id} , "secretKey");
            res.cookie("token" , token);
            res.status(200).redirect("/confession");
        }else{
            res.send("wrong password");
        }
    })
})

app.get("/login" , (req,res)=>{
    res.render("login");
});

app.get("/logout" , (req,res)=>{
    res.cookie("token" , "");
    res.redirect("/login");
});


app.post("/post" ,isLoggedIn, async(req,res)=>{
    let user = await userModel.findOne({email:req.user.email});
    console.log("Request body:", req.body);
    let{content} = req.body;
    let post = await postModel.create({
        user:user._id,
        content,
        isPublic:true
    });
        user.posts.push(post._id);
        await user.save();
        res.redirect("/confession");
        console.log(post);
})


function isLoggedIn(req,res,next){
    if(req.cookies.token === "") res.redirect("/login");
        else{
            let data = jwt.verify(req.cookies.token , "secretKey");
            req.user = data;  
            next();  
        }
};

app.get("/posts" , isLoggedIn ,async(req,res)=>{
    let user = await userModel.findOne({email : req.user.email});
    res.render("posts");
});

app.post("/delete/:id", isLoggedIn, async (req, res) => {
  const post = await postModel.findById(req.params.id);

  if (!post) return res.status(404).send("Post not found");

  if (post.user.toString() !== req.user.userId) {
    return res.status(403).send("Unauthorized");
  }

  await postModel.findByIdAndDelete(req.params.id);


  await userModel.findByIdAndUpdate(req.user.userId, {
    $pull: { posts: req.params.id }
  });

  res.redirect("/confession");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});