const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isPremium = async function (req, res, next) {
  const token = req.header("x-auth-token");

  try {
    if (!token) {
      return res
        .status(401)
        .json({ error: "No authentication token provided" });
    }

    const decoded = jwt.verify(token, "PROJECTWS");
    const user = await User.findOne({ where: { user_id: decoded.user_id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.premium == false) {
      return res.status(403).send({ message: "You are not Premium yet!" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = isPremium;
