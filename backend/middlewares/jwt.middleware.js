import jwt from "jsonwebtoken";

const jwtsecret = process.env.JWT_SECRET || "your_jwt_secret";

export const verifyToken = (req, res, next) => 
    {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) 
    {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
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