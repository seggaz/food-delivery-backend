const jwt = require('jsonwebtoken');
const SECRET_KEY = '12345';

const verifyToken = (req, res, next) => {
  const authToken = req.headers.authorization.split(' ')[1];
  
  if (!authToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decodedToken = jwt.verify(authToken, SECRET_KEY);
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { verifyToken };
