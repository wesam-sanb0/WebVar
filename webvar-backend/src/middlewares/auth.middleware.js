import  jwt  from 'jsonwebtoken';
import User from '../models/user.model.js';
export const auth =async (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers?.authorization||req.cookies.authToken;;

    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.replace("Bearer ", "");


    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_ACCESS);

        const user=await User.findById(decoded.userID).select('-password')

        if(!user){
            return res.status(404).json({ message: "User not found" })
        }

        // Attach the user data to the request object
        req.user = user;

        // Call the next middleware or route handler to complete process of requrest
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(400).json({ message: "Invalid or expired token." });
    }
};