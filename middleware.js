const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const publicRoutes = ['/register', '/login'];

  if (publicRoutes.includes(req.path)) {
    return next();
  }
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
