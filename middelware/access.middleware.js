const jwt = require('jsonwebtoken');



exports.verify = function(req, res, next) {
    var accessToken = req.headers["authorization"] || req.headers["x-access-token"];

    if(!accessToken) {
        console.log(req.headers);
        return(res.status(403).send({
            message: "No token provided!"
        }));
    }

     if(accessToken.startsWith('Bearer ')){
        accessToken = accessToken.slice(7,accessToken.length);
        console.log(accessToken);
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET,(err, decoded)=>{
        if(err){
            return(res.status(401).send({
                status: "error",
                error: err.message,
                accessToken
            }));
        }

        console.log(decoded);

        next();

    });

    
}


