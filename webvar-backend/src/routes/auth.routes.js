import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as authValidator from "../validators/auth.validation.js"
import { auth } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { multerMiddleHost } from "../middlewares/multer.middleware.js";

export const authRouter = Router()

authRouter.post("/register", validationMiddleware(authValidator.signupSchema), authController.register)
authRouter.get("/verify-email", validationMiddleware(authValidator.emailVerificationSchema), authController.verifyEmail)
authRouter.post("/login", validationMiddleware(authValidator.loginSchema), authController.login)
authRouter.get("/profile", auth, authController.getProfile)
authRouter.post("/forget-password", validationMiddleware(authValidator.forgotPasswordSchema), authController.forgetPassword)
authRouter.post("/reset-password", validationMiddleware(authValidator.resetPasswordSchema), authController.resetPassword)
authRouter.put("/change-password", auth, validationMiddleware(authValidator.changePasswordSchema), authController.changePassword)
authRouter.post("/upload-profile-image", auth, multerMiddleHost().single("profile-image"), authController.uploadProfileImage)
authRouter.post("/contact-us", authController.contactUs)
