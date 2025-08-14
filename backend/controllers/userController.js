import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from '../utils/cloudinary.js';



const cookieOptions = {
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite:'None',
    secure: true

} 
// Register user
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const profilePic = req.file; // From multer

    if (!email) {
      return res.status(400).json({success:false, message: 'Email is required' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success:false,message: 'Password is required and must be at least 8 characters' });
    }
    if (!name) {
      return res.status(400).json({success:false, message: 'Name is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success:false,message: 'User already exists' });
    }


    let profileImage = null;
    if (profilePic) {
      const uploadResult = await uploadOnCloudinary(profilePic);
      if (uploadResult) {
        profileImage = uploadResult.secure_url;
      }
    }

    const user = new User({ email, password, name, profileImage });
    await user.save();

const token = await user.generateJWTtoken()
res.cookie('token' ,token ,cookieOptions)

   return res.status(201).json({success:false, message: 'User registered successfully', user });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({success:false, message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({success:false, message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({success:false, message: 'Password is required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success:false,message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success:false,message: 'Invalid credentials' });
    }

   user.password = undefined;
const token = await user.generateJWTtoken()
res.cookie('token' ,token ,cookieOptions)
   return res.status(200).json({ success:true,message: 'Login successful', user });
    
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success:false,message: 'Server error during login' });
  }
};

// Get user details
export const getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({success:false, message: 'User not found' });
    }
    return res.status(200).json({ success:true,message: 'User details fetched successfully', user });
  } catch (error) {
    console.error('Get user detail error:', error.message);
    res.status(500).json({success:false, message: 'Server error while fetching user details' });
  }
};

// Logout user
export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

// Edit profile
export const editProfile = async (req, res) => {
 
  try {
    const { name, email } = req.body;
    const profilePic = req.file;
    const userId = req.user.id;

    const updates = {};
    if (name) updates.name = name;
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updates.email = email;
    }

    if (profilePic) {
      const uploadResult = await uploadOnCloudinary(profilePic);
      if (uploadResult) {
        updates.profileImage = uploadResult.secure_url;
      }
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({success:false, message: 'User not found' });
    }
    return res.status(200).json({ success:true,message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Edit profile error:', error.message);
    return res.status(500).json({ success:false,message: 'Server error while editing profile' });
  }
};


