
const jwt = require('jsonwebtoken');
const config = require('../../config');
//Middleware, millega kontrollitakse jsonwebtokeni valiidsust ja olemas olu
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.substring(7) : false;
    const verified = token ? await jwt.verify(token, config.jwtSecret) : false;
    
    if (verified) {
      req.user = verified.id;
      next();
    } else {
      res.status(401).json({
        success: false,
        message: 'Token puudub'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: 'Token ei ole valiidne'
    });
  }
}
module.exports = isLoggedIn;