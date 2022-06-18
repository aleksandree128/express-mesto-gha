const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundErrors = require('../codes__errors/notFound-errors');
const ReqErrors = require('../codes__errors/req-errors');
const AuthErrors = require('../codes__errors/auth-errors');
const ServerErrors = require('../codes__errors/server-errors');
const ConflictedErrors = require('../codes__errors/conflicted-errors');

const getUser = (req, res, next) => { User
  .find({})
  .then((user) => res.send({ data: user })
  )
  .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((users) => {
      const outUser = {
        name: users.name,
        about: users.about,
        avatar: users.avatar,
        _id: users._id,
      };
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ReqErrors( `${ fields } are not correct`);
        return;
      }
      if (err.code === 11000) {
        throw new ConflictedErrors('Users not found');
      }
      throw new ServerErrors('Server error');
})
    .catch((err) => next(err));
};

const getUsers = (req, res, next) => {
  User
    .find({})
    .then((users) => {
      if (users === null) {
        throw new NotFoundErrors('Users not found');
      } else {
        return res.send({ data: users });
      }
    })
    .catch((err) => next(err));
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => next(err));
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { avatar }, {
      new: true,
      runValidators: true,
    })
    .then((users) =>
      res.send({ data: users }))
    .catch((err) => next(err));
};

const getLogin = (req, res, next) = {
  const { email, password } = req.body;
  user.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthErrors('invalid user or password');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthErrors('invalid user or password');
          }
          return user;
        });
    })
    .then((data) => {
      data.send({
        token: jwt.sign({ _id: data._id }, 'some-secret-key', {
          expiresIn: '7d',
        }),
      });
    })
    .catch((err) => next(err));
};

const getUserI = (req, res, next) => {
  const { _id } = req.user;
  user.findOne(
    { _id },
  )
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => next(err));
}


module.exports = {
  getUser,
  createUser,
  getUsers,
  updateUserInfo,
  updateUserAvatar,
  getLogin,
  getUserI,
};
