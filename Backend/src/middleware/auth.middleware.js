import jwt from 'jsonwebtoken';
import  User from "../models/users.model.js"

export const protectRoute = async (req, res,next) =>{

    try{
       
        const token= req.cookies.jwt;
        if(!token){
            return res.status(401).json({msg: 'No token, authorization denied'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({msg: 'Token expired, authorization denied'});
        }

        const user= await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(404).json({msg: 'User not found'});
        }
        // attaching the user object (current user) to the request object
        req.user=user;
        next();
    }catch(err){       
      console.log(err);
      return res.status(500).json({msg: 'Token verification failed'});
    }
}