const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.header("authorization").replace("Bearer ", "");
    const decrypedData = jwt.verify(token, process.env.jwt_secret);
    req.body.userId = decrypedData.userId;
    next();
    // next() method is the "get current user" logic in server/routes/usersRoutes.js
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};
