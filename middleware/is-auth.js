const jwt = require('jsonwebtoken');

//  a miidleware that check for me if a user is authenticated and authorized

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not Authenticated.');
        error.statusCode =401;
        throw error;
    }
    const token = authHeader.split(' ')[1];  // Bearer kjshajfsajdsfn
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'supersecretsecretkey');
    } catch (err ) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not Authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};