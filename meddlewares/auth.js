const jwt = require('jsonwebtoken');
const AuthErrors = require('../codes__errors/auth-errors');

module.exports = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startsWith('Bearer ')) {
    throw new AuthErrors('nesessary authorisation');
  }
  const token = auth.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthErrors('nesessary authorisation');
  }
  req.user = payload;
  next();
};
