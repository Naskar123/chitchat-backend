const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

// function for registering a new user ...
const registerUser = asyncHandler(async(req,res) => {
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("please enter data in all fields");
    }
// if emails found in the database ...
    const userExists= await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("user already exists");
    }
// else create new user in the database    
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if(user){
        res.status(201).json({
            _id : user._id,
            name:user.name,
            email : user.email,
            pic : user.pic,
            token : generateToken(user._id),
        });
    }else{
        res.status(400);
        throw new Error("Failed to create the user");
    }
});

//function for login...
const authUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json({
            _id : user._id,
            name:user.name,
            email : user.email,
            pic : user.pic,
            token : generateToken(user._id),
        })
    }else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

//start of lecture 10
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = {registerUser,authUser, allUsers};