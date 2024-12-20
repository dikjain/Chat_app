import expressAsyncHandler from "express-async-handler"
import User from "../models/user.model.js";
import generateToken from "../db/GenerateToken.js";

const updateUser = expressAsyncHandler(async (req, res) => {
    const { name, pic, UserId } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(UserId, { name, pic }, { new: true });

        if (!updatedUser) {
            res.status(404);
            throw new Error("User not found");
        }

        res.json(updatedUser)
    } catch (error) {
        res.status(500);
        throw new Error("Error updating user");
    }
});


const updatelanguage = expressAsyncHandler(async (req, res) => {
    const { language , UserId } = req.body;
    const updatedUser = await User.findByIdAndUpdate(UserId, { TranslateLanguage: language }, { new: true });
    res.json(updatedUser.TranslateLanguage);
});

const registeruser = expressAsyncHandler (async (req,res) => {
    const {name,email,password,pic} = req.body

    if (!name || !email || !password) {
        res.status(404);
        throw new Error("Please provide all fields");
    }


    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({name, email, password,pic})

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
            TranslateLanguage: user.TranslateLanguage
        });
    }else{
        res.status(400);
        throw new Error("Invalid user data");
    }

})




const authUser = expressAsyncHandler (async (req,res) => {
    
    const {email, password} = req.body
    
    if (!email || !password) {
        res.status(409);
        throw new Error("Please provide all fields");
    }
    
    const userExists = await User.findOne({email})
    

    if(userExists && (userExists.matchPassword(password))){
        res.json({
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
            pic: userExists.pic,
            token: generateToken(userExists._id),
            TranslateLanguage: userExists.TranslateLanguage
        })
        
    } else {
        res.status(401); // Unauthorized status for invalid credentials
        throw new Error("Invalid email or password");
      }

    
})
const getuserdetails = expressAsyncHandler (async (req,res) => {
    const {email} = req.body
    const userExists = await User.findOne({email})
    if(userExists){
        res.json({
            name: userExists.name,
            pic: userExists.pic,
        })
        
    } else {
        res.status(401); // Unauthorized status for invalid credentials
        throw new Error("Invalid email");
      }

    
})


const allUsers = expressAsyncHandler (async (req,res) => {
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


export { authUser, registeruser,allUsers,getuserdetails,updateUser,updatelanguage }; 