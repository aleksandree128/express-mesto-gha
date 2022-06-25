const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErrors = require('../codes__errors/notFound-errors');
const ReqErrors = require('../codes__errors/req-errors');
const AuthErrors = require('../codes__errors/auth-errors');
const ConflictedErrors = require('../codes__errors/conflicted-errors');

const getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(201).send({
      data: {
        name,
        about,
        avatar,
        email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('неверные данные'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictedErrors('Пользователь с таким адресом электронной почты уже существует'));
        return;
      }
      next(err);
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        throw new NotFoundErrors('Пользователь не найден');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ReqErrors('id неверен'));
        return;
      }
      next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundErrors('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('неверные данные'));
        return;
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundErrors('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('неверные данные'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new AuthErrors('Email или пароль неверны'));
      }
      next(err);
    });
};

const findUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUser,
  createUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  login,
  findUserMe,
};
