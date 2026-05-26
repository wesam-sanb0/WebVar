const reqKeys=['body','headers','query','params']

export const validationMiddleware = (schema) => {
    return async (req, res, next) => {
        let validationErrors = [];

        for (const key of reqKeys) {
            if (!schema[key]) continue; 
            const dataToValidate = req[key] ?? {}; 
            const validationResult = schema[key].validate(dataToValidate, { abortEarly: false });

            if (validationResult.error) {
                validationErrors.push(...validationResult.error.details);
            } else {
                if (key === 'body' || key === 'params') {
                    req[key] = validationResult.value;
                } else {
                    Object.assign(req[key], validationResult.value); 
                }
            }
        }
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: "Validation error", errors: validationErrors });
        }

        next();
    };
};