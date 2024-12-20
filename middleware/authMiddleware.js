const jwt = require("jsonwebtoken");


exports.decodeUserJWTToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (token == null) {
      return res.status(401).json({
        status: false,
        message: "Token is not given",
      });
    }
    // No token present
    console.log(token, "token", process.env.JWT_SECRET_KEY);
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        // return res.sendStatus(403);  // Invalid token
        return res.status(401).json({
          status: false,
          message: "Token is not valid",
        });
      }

      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.decodeAdminJWTToken = async (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  
      if (token == null) {
        return res.status(401).json({
          status: false,
          message: "Token is not given",
        });
      }
      // No token present
      console.log(token, "token", process.env.JWT_SECRET_KEY);
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
          // return res.sendStatus(403);  // Invalid token
          return res.status(401).json({
            status: false,
            message: "Token is not valid",
          });
        }
       
        req.user = user;
        console.log(req.user, 'admin')
        if(req.user.role != 'admin')
        {
            return res.status(500).json({
                status: false,
                message: "You are not authenticated to this",
              });
        }
        next();
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  };






