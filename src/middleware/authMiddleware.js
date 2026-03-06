import jwt from "jsonwebtoken";
import User from "../models/User.js";


// 1. Extract token from Authorization header
// 2. Verify token
// 3. Find user
// 4. Attach user to req.user
// 5. Call next()
// 6. If invalid → return 401

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    // This handles both "Bearer <token>" and just "<token>"
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.split(" ")[1] 
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
export default authMiddleware;