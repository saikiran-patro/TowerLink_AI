import User from "../models/users.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utlis.js";
import cloudinary from "../lib/cloudinary.js";
export const signup= async (req, res) => {
 
    const {fullName, email, password} = req.body;
    if(!fullName ||!email ||!password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
           if(password.length<6){
            return res.status(400).json({message:" Password must be at least 6 characters"});

           }
           const user = await User.findOne({email: email});

           if(user){
            return res.status(400).json({message:"User already exists"});
           }
           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash(password, salt);
           const newUser = new User({fullName, email, password:hashedPassword});
           if(newUser){
              // generate jwt token
            const token= generateToken(newUser._id,res);
          
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePicture:newUser.profilePicture
            })
           }
           else{
            res.status(400).json({message:"Error creating user"});
           }
    }
    catch(error){
        res.status(500).send('Server Error')
    }
    
}

export const login=async (req, res) => {
   
    const {email, password} = req.body;
    if(!email ||!password){
        return res.status(400).json({message:"All fields are required"});
    }
    

    try{
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({message:"Invalid Credentials"});

        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        // generate jwt token
        const token= generateToken(user._id,res);
        res.status(200).json({_id: user._id,fullName:user.fullName,email:user.email,profilePicture:user.profilePicture});
    }
    catch(error){
        res.status(500).send('Internal Server Error')
    }
}

export const logout=(req, res) => {
    
    try{
      res.cookie("jwt","",{maxAge:0})
      res.status(200).json({message:"logout successfully"});
    }
    catch(error){
        res.status(500).send('Internal Server Error')
    }
}

export const updateProfile = async (req, res) => {

 try{
    const {profilePicture} = req.body;
    const userId = req.user._id;
    if(!profilePicture){
        return res.status(400).json({message:"Profile picture is required"});
    }

    const uploadResponse= await cloudinary.uploader.upload(profilePicture);
    if(!uploadResponse){
        return res.status(400).json({message:"Error uploading profile picture"});
    }


    const updatedUser = await User.findByIdAndUpdate(userId, {profilePicture:uploadResponse?.secure_url}, {new: true});
    if(updatedUser){
        res.status(200).json({message:"Profile updated successfully", profilePicture: updatedUser.profilePicture});
    }
    else{
        res.status(404).json({message:"User not found"});
    }
 }
 catch(error){
    res.status(500).send('Internal Server Error')
 }

}

export const checkAuth = (req, res) => {


    try{
        if(!req.user){
            return res.status(401).json({message:"User not authenticated"});
        }
        res.status(200).json(req.user);

    }
    catch(error){
        res.status(500).send('Internal Server Error')
    }
}