const jwt = require("jsonwebtoken");

exports.verify = function (options) {
  return function (req, res, next) {
    var accessToken =
      req.headers["authorization"] || req.headers["x-access-token"];

    if (!accessToken) {
      //console.log(req.headers);
      return res.status(403).send({
        message: "TOKEN NO EXISTE",
      });
    }

    if (accessToken.startsWith("Bearer ")) {
      accessToken = accessToken.slice(7, accessToken.length);
      //console.log(accessToken);
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      (err, verified) => {
        if (err) {
          return res.status(401).send({
            status: "error",
            error: err,
          });
        }

        if (verified) {
          let payload = jwt.decode(accessToken, { json: true });
          
          //pasar el payload, para más verifaciones
          req.payload = payload;
        }
      }
    );
    next();
  };
};
