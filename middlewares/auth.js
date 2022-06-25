const jwt = require('jsonwebtoken');
const AuthErrors = require('../code_errors/AuthErrors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthErrors('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthErrors('Требуется авторизация'));
  }
  req.user = payload;

  next();
};
