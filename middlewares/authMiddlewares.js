//Create by Nattawut.C 11/11/24
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //get token from header
  const token = req.headers["authorization"]?.split(" ")[1]; // Assume token is passed as "Bearer <token>"
  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });

  try {
    //recheck decode token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403).json({ message: "Invalid token." });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      //token expired
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    //Invalid token.
    return res.status(403).json({ message: "Invalid token." });
  }
};

// เพิ่ม middleware ตรวจ role แยก
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions." });
    }
    next();
  };
};

module.exports = { verifyToken, allowRoles };
