const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ msg: 'UnAuthorized, token not found' })
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).josn({ msg: 'UnAuthorized' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next();
        
    } catch (error) {
        console.log(error)
        res.status(401).josn({ err: 'Invalid token' });
    }
    
}

const generateToken = (userData) => {
     
    return jwt.sign(userData, process.env.JWT_SECRET);
}

module.exports =
    { jwtAuthMiddleware, generateToken };