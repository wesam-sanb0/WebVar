
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  profileImage: {
    public_id: String,
    secure_url: String
  },
  resetPasswordToken: String,
  resetPasswordExpires:Date
}, {
  timestamps: true // adds createdAt and updatedAt
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User