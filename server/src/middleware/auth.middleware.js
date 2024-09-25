import jwt from 'jsonwebtoken';
import {User} from '../models/userModel.js';

export const Auth = async (req, res, next) => {
  try {
    // Extract token from headers
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
      return res.status(400).json({
        message:"Unauthorized Token"
      })
    }

    
      const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

      // Fetch user from database
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Set the req properties for further use
      req.token = token;
      req.user = user
    
    next();  // Proceed to the next middleware/controller
  } catch (error) {
    // Handle any errors such as invalid token, user not found, etc.
    console.error(error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
