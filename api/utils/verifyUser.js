import jwt from "jsonwebtoken"
export const verifyToken = (req, res, next) => {

    const token = req.cookies.acess_token;
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error,user)=>{
        if(error){
            // Don't expose specific error details to prevent token attacks
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        req.user = user;
        next();

    })

}