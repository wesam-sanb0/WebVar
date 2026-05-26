import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import webvarSendMail from "../utils/send-email.utils.js"
import {generateResetPasswordEmail, generateVerificationEmail} from "../utils/email-templates.js"
import { cloudinaryConfig} from "../utils/cloudinary.utils.js"

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        // Check if email or username is already used to avoid email or username duplication
        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            return res.status(400).json({ message: "Email or username already exists" })
        }

        // Hash password to improve security
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user document
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        // Save the user in database
        await newUser.save()

        // Generate verification token
        const verificationToken = jwt.sign(
            { userID: newUser._id },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" } // Token expires in 1 hour
        )

        // Create the verification link
        const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`

        // Send verification email
        const message = generateVerificationEmail({ username, verificationLink })

        const emailSent = await webvarSendMail({
            to: email,
            subject: "Verify your email",
            message
        })
        if (!emailSent) {
            await User.findByIdAndDelete(newUser._id)
            return res.status(500).json({ message: "Failed to send verification email" })
        }
        
        return res.status(201).json({ message: "User registered. Please verify your email." })

    } catch (error) {
        console.error("Register error:", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export const verifyEmail = async (req, res) => {
    const { token } = req.query

    if (!token) {
        return res.status(400).json({ message: "Invalid or expired verification link" })
    }

    try {
        // Verify token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Find the user by ID
        const user = await User.findById(decoded.userID)

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        // Check if the email is already verified
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email already verified" })
        }

        // Mark email as verified
        user.isEmailVerified = true
        await user.save()

        return res.status(200).json({ message: "Email verified successfully!" })
    } catch (error) {
        console.error("Email verification error:", error)
        return res.status(400).json({ message: "Invalid or expired verification link" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ userID: user._id }, process.env.JWT_ACCESS, { expiresIn: "7d" })

        res.cookie('authToken', token, {
            httpOnly: true, // Prevents JavaScript access
            secure: process.env.NODE_ENV === 'production', // Use Secure in production (requires HTTPS)
            sameSite: 'strict', // Mitigates CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
        });

        return res.status(200).json({ 
            message: "Login successful",
            token,
            username: user.username,
            email: user.email
        })
    } catch (error) {
        console.error("Login error:", error)        
        return res.status(500).json({ message: "Something went wrong" })    
    }
}


export const getProfile = async (req, res) => {
    try {
        const user = req.user
        return res.status(200).json({message:"Get profile successful",user})
    } catch (error) {
        console.error("Get profile error:", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export const forgetPassword = async (req, res) => {
    const {email}=req.body

    try {
        const user=await User.findOne({email})

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const token = jwt.sign({ userID: user._id }, process.env.JWT_RESET, { expiresIn: "1h" })

        const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`

        const message = generateResetPasswordEmail({ username: user.username, resetLink })

        const emailSent = await webvarSendMail({
            to: email,
            subject: "Reset your password",
            message
        })
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send reset password email" })
        }

        return res.status(200).json({ message: "Password reset email sent successfully" })
    } catch (error) {
        console.error("Forget password error:", error)
        return res.status(500).json({ message: "Something went wrong" })    
    }
    
}

export const resetPassword = async (req, res) => {
    const {token}=req.query
    const {password}=req.body
    try {
        const decoded = jwt.verify(token, process.env.JWT_RESET)

        const user = await User.findById(decoded.userID)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        await user.save()

        return res.status(200).json({ message: "Password reset successful" })
    } catch (error) {
        console.error("Reset password error:", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body

        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        // Check if the old password is correct
        const user = await User.findById(req.user._id)
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid old password" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword

        await user.save()
        return res.status(200).json({ message: "Password changed successfully" })
    } catch (error) {
        console.error("Change password error:", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export const uploadProfileImage = async (req, res,next) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(400).json({ message: "Please upload an image" });
        }
        
        const cloudinary = cloudinaryConfig();
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: "webvar/Users" })

        const user = await User.findById(req.user._id)
        user.profileImage = { secure_url, public_id }

        await user.save()
        return res.status(200).json({ message: "Profile image uploaded successfully" })
    } catch (error) {
        console.error("Upload profile image error:", error)
        return res.status(500).json({ message: "Something went wrong" })    
    }
}

export const contactUs=async(req,res)=>{
    try {
        const {name,email,message}=req.body
        const messageSent=await webvarSendMail({
            to:process.env.EMAIL,
            subject:`Contact from ${name}`,
            message:`<h3>Name:</h3>${name}<br><h3>Email:</h3>${email}<br><h3>Message:</h3>${message}`
        })
        if(!messageSent){
            return res.status(500).json({message:"Failed to send message"})
        }
        return res.status(200).json({message:"Message sent successfully"})
    } catch (error) {
        console.error("Contact us error:", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}