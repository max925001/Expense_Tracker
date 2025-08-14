import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Don't return password in queries
  },
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
}, { timestamps: true });



userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods = {
  generateJWTtoken: async function () {
    return await jwt.sign(
      {
        id: this._id,
        email: this.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );
  },
  comparePassword: async function (plaintextPassword) {
   
    return await bcrypt.compare(plaintextPassword, this.password);
  },
};


const User = mongoose.model('User', userSchema);
export default User;