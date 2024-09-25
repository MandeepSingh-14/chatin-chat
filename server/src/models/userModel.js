import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true   
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    bio:{
        type:String,
        default:'Available'
    },
    profilePic:{
        type:String,
        default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    contacts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
    ],
},{
    timestamps:true
});

userSchema.pre('save', async function () {
    try {
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password, 10);
        }
        
        next();
    } catch (error) {
        console.log(error)
    }    
})

userSchema.methods.generateAuthToken = async function () {
    try {
      let token = jwt.sign(
        { 
            id: this._id, 
            email: this.email },
            process.env.SECRET,
        {
          expiresIn: '24h',
        }
      );
      
      return token;
    } catch (error) {
      console.log('error while generating token');
    }
  };


export const User = mongoose.model('User', userSchema);
