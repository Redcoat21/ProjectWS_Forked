const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async function (req, res, next) {
  const token = req.header("x-auth-token");

  try {
    if (!token) {
      return res
        .status(401)
        .json({ error: "No authentication token provided" });
    }

    const decoded = jwt.verify(token, "PROJECTWS");
    const user = await User.findOne({ where: { user_id: decoded.user_id } });

    if (!user ) {
      return res.status(404).json({ error: "User not found" });
    }

    // updaate api hit by Rey
    if(user.api_hit <=0 ) {
      return res.status(401).json({ error: "Insufficient API Hit" });
    }
     
    await user.update({ api_hit: user.api_hit - 1 });

    req.headerToken = token;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid authentication token" });
  }
};

module.exports = authMiddleware;
