
import authRouter from './routes/auth.route.js'
import messageRouter from './routes/message.route.js'
import dotenv from 'dotenv'
import connectDb from './lib/db.js';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import path from "path"
import { app, server, io, express } from './lib/socket.js';


dotenv.config();
const Port= process.env.PORT || 5000
const __dirname= path.resolve()
app.use(cors({
    origin: "http://localhost:5173", // ✅ Your frontend URL
    credentials: true, // ✅ ALLOW COOKIES & AUTH HEADERS
    methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  }));
app.use(express.json()); // middleware to use req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // middleware to extact informaiton from the cookie token

app.use('/api/auth',authRouter);
app.use('/api/messages',messageRouter);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../UI/dist")));
  app.get("*",(req,res)=>{
       res.sendFile(path.join(__dirname,"../UI","dist","index.html"));
  })
}
server.listen(Port, () => {
    console.log('Server is running on port '+ Port)
    connectDb(); // Connect to MongoDB database.
})