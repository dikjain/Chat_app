import expressAsyncHandler from "express-async-handler"
import User from "../models/user.model.js";
import generateToken from "../db/GenerateToken.js";

const updateUser = expressAsyncHandler(async (req, res) => {
    const { name, pic, UserId } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(UserId, { name, pic }, { new: true });

        if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json(updatedUser)
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ERROR: User update failed:`, error.message);
        return res.status(500).json({ success: false, message: "Error updating user" });
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
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    if (name.length < 2 || name.length > 50) {
        return res.status(400).json({ success: false, message: "Name must be between 2 and 50 characters" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }


    const userExists = await User.findOne({email})

    if(userExists) {
        return res.status(409).json({ success: false, message: "User already exists" });
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
        return res.status(400).json({ success: false, message: "Invalid user data" });
    }

})




const authUser = expressAsyncHandler (async (req,res) => {
    
    const {email, password} = req.body
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }
    
    const userExists = await User.findOne({email})
    

    if(userExists && (await userExists.matchPassword(password))){
        res.json({
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
            pic: userExists.pic,
            token: generateToken(userExists._id),
            TranslateLanguage: userExists.TranslateLanguage
        })
        
    } else {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

    
})
const getuserdetails = expressAsyncHandler (async (req,res) => {
    try {
        const {email} = req.body
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const userExists = await User.findOne({email})
        if(userExists){
            res.json({
                success: true,
                name: userExists.name,
                pic: userExists.pic,
            })
        } else {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ERROR: Get user details failed:`, error.message);
        return res.status(400).json({ success: false, message: "Failed to get user details" });
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