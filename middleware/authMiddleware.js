const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.authMiddleware = (allowedRoles = []) => {
return async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (!decoded.id) {
                return res.status(400).json({ message: "Invalid token payload" });
            }
            //without password
            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User is not found" });
            }
            req.user = user;
            // Check role
        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: "Access Denied" });
        }

            next();
        }
        catch (error) {
            return res.status(401).json({
                message: `Forbidden Token ${error.message}`
            })
        }
    }
    else {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

}
}