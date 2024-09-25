import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs-extra';
import path from 'path';
import { profile } from 'console';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Register User
export const register = async (req, res) => {

    // console.log(req.body)
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        
        // const profileLocalPath = req.files?.avatar[0]?.path;
        // if(!profileLocalPath){
        //     return res.status(400).json({
        //         message:"path not found"
        //     })
        // }
    
        // const profile = await uploadOnCloudinary(profileLocalPath)
        // if(!profile)
        // {
        //     return res.status(400).json({
        //         message:"profilepic required!!!"
        //     })
        // }
        const newUser = new User({
            name,
            email,
            password
            // profilePic : profile.url
        });

        await newUser.save();

        const token = await newUser.generateAuthToken();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const valid = await User.findOne({ email });
        if (!valid) {
            return res.status(400).json({
                message: 'User not found',
            });
        }

        const validPassword = await bcrypt.compare(password, valid.password);
        if (!validPassword) {
            return res.status(400).json({
                message: 'Wrong password',
            });
        }else{
        const token = await valid.generateAuthToken();
        await valid.save()
        res.cookie('userToken', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
        });
        res.status(200).json({ token, status: 200 });
      }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout User
export const logoutUser = async (req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { 
                refreshToken : 1
            }
        },
        {
            new: true
        }
    )   
    const options = {
        httpOnly: true,
        secure: true
    }
        return res
        .status(200)
        .clearCookie("accessToken" ,options)
        .clearCookie("resfreshToken" ,options)
        .json({message : "User successfully logged out"})
}


// Search Users
export const searchUsers = async (req, res) => {
    const search = req.query.search
        ? {
              $or: [
                  { name: { $regex: req.query.search, $options: 'i' } },
                  { email: { $regex: req.query.search, $options: 'i' } },
              ],
          }
        : {};

    try {
        const users = await User.find(search).find({ _id: { $ne: req.rootUserId } });
        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User by ID
export const getUserByID = async (req, res) => {
    const { id } = req.params;
    try {
        const selectedUser = await User.findById(id).select('-password');
        if (!selectedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(selectedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// // Upload Profile Picture
// export const uploadProfilePic = async(req,res) =>{
//     const profileLocalPath = req.files?.avatar[0]?.path;

    
    
//     const profile = await uploadOnCloudinary(profileLocalPath)
//     if(!profile){
//         return res.status(403).json({message: "error while uploading profile"});
//     }

//     const user = await User.findById(
//         req.user?._id,
//         {
//             $set:{
//                 profilePic
//             }
//         },
//     )
// }   

export const updateInfo = async (req, res) => {
    const {name,email} = req.body

    if(!name || !email){
        return res.status(400).json({message: "all fields are required"})
    }

    const user = User.findById(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: True}
    ).select("-password")

    return res
    .status(200)
    .json({message :"Details Updated Successfully"  , user : user});
}