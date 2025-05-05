import mongoose from 'mongoose';

const connectDb= async ()=>{
   
    try{
         const connect=await mongoose.connect(process.env.MONGODB_URI)
         console.log(`MongoDB Connected: ${connect.connection.host}`);
        }
    catch(error){
        console.log(`MongoDB Error: ${error}`);
    }
  

}

export default connectDb;