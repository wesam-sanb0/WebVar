import Joi from "joi";

// Signup Schema
export const signupSchema = {
    body: Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .messages({
                "string.base": "Username must be a string",
                "string.empty": "Username is required",
                "string.min": "Username must be at least 3 characters",
                "string.max": "Username must be at most 30 characters",
                "string.alphanum": "Username can only contain letters and numbers",
                "any.required": "Username is required",
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Please enter a valid email address",
                "string.empty": "Email is required",
                "any.required": "Email is required",
            }),

        password: Joi.string().min(6).max(30).required().messages({
            "string.base": "Password must be a string",
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "string.max": "password must be at most 30 characters",
            "any.required": "Password is required",
        })
    }),
};


export const loginSchema = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Please enter a valid email",
                "string.empty": "Email is required",
                "any.required": "Email is required",
            }),

        password: Joi.string().required().messages({
            "string.base": "Password must be a string",
            "string.empty": "Password is required",
            "any.required": "Password is required",
        }),
    }),
};


export const forgotPasswordSchema = {
    body: Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
                "string.email": "Please enter a valid email",
                "string.empty": "Email is required",
                "any.required": "Email is required",
            }),
    }),
};

// Reset Password Schema
export const resetPasswordSchema = {
    body: Joi.object({
        password: Joi.string().min(6).max(30).required().messages({
            "string.base": "Password must be a string",
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "string.max": "password must be at most 30 characters",
            "any.required": "Password is required",
        }),
        confirmPassword: Joi.any()
            .valid(Joi.ref("password"))
            .required()
            .messages({
                "any.only": "Password and Confirm Password must match",
                "any.required": "Confirm Password is required",
            }),
    }),
    query: Joi.object({
        token: Joi.string().required().messages({
            "string.base": "Token must be a string",
            "string.empty": "Token is required",
            "any.required": "Token is required",
        }),
    }),
};


export const emailVerificationSchema = {
    query: Joi.object({
        token: Joi.string().required().messages({
            "string.base": "Token must be a string",
            "string.empty": "Token is required",
            "any.required": "Token is required",
        }),
    }),
};

export const changePasswordSchema = {
    body: Joi.object({
      oldPassword: Joi.string()
        .required()
        .messages({
          'any.required': 'Old password is required',
          'string.empty': 'Old password cannot be empty',
        }),
        
      newPassword:Joi.string().min(6).max(30).required().messages({
        "string.base": "new Password must be a string",
        "string.empty": "new Password is required",
        "string.min": "new Password must be at least 6 characters",
        "string.max": "new Password must be at most 30 characters",
        "any.required": "new Password is required",
    }),
        
      confirmNewPassword: Joi.string()
        .required()
        .valid(Joi.ref('newPassword'))
        .messages({
          'any.required': 'Confirm new password is required',
          'any.only': 'Confirm password must match the new password',
          'string.empty': 'Confirm password cannot be empty',
        }),
    }),
  };