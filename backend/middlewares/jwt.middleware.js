import jwt from "jsonwebtoken";

const jwtsecret = process.env.JWT_SECRET ;

export const verifyToken = (req, res, next) => 
    {
       const token = req.cookies.token;

    if (!token) 
    {
        return res.status(401).json({ message: "Unauthorized" });
    }

   
    jwt.verify(token, jwtsecret, (err, decoded) => 
        {
        if (err) 
        {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
};