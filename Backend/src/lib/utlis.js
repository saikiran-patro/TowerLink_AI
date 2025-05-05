import jwt from 'jsonwebtoken';
export const generateToken=(userId,response) =>{

    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
    response.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true, // prevent XSS attacks cross-site scriptiong attacks
        secure:process.env.NODE_ENV === "production", // use HTTPS only in production environment;
        sameSite:"Strict" // CSRF attacks cross-site request forgery attacks
        
    })

    
    return token
}