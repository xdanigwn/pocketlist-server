const jwt = require("jsonwebtoken");

function authAPI (req, res, next ) { // next() running after this function succeed
    try {
        // console.log(req.cookies); // get 
        const token = req.cookies.token; // cookie parser
        if(!token) {
            // res.status(401).json({ errorMessage : "Unauthorized"}) 
            return res.redirect("http://localhost:3001");
            // res.render("index");
            // res.json(false) 
        }
        const verified = jwt.verify(token, "jwtsecret1234") //compare token with secret. if error go to catch

        req.user = verified.user;
        // console.log(req.user);
        // res.json(true)
        next(); 
    } catch (err) {
        console.log(err);
        res.status(401).json({errorMessage : "Unauthorized"})
    }  
}

module.exports = authAPI;  