const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const header = req.header('Authorization') || '';
  const token  = header.replace('Bearer ', '');
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
