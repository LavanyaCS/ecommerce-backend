const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded?.id) {
        return res.status(400).json({ message: "Invalid token payload" });
      }

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Attach user to request for later use
      req.user = user;

      // Role-based authorization
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: `Invalid or expired token: ${error.message}` });
    }
  };
};
