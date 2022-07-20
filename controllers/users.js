const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErrors = require('../code_errors/notFound-errors');
const ReqErrors = require('../code_errors/req-errors');
const AuthErrors = require('../code_errors/AuthErrors');
const ConflictedErrors = require('../code_errors/conflicted-errors');

const getUsers = (req, res, next) => {
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
    .then(() => res.send({
      data: {
        name,
        about,
        avatar,
        email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('incorrect data'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictedErrors('A user with this email address already exists'));
        return;
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (users === null) {
        throw new NotFoundErrors('the user will not find');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ReqErrors('id incorrect'));
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
    .then((users) => {
      if (users === null) {
        throw new NotFoundErrors('the user will not find');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('incorrect data'));
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
    .then((users) => {
      if (users === null) {
        throw new NotFoundErrors('the user will not find');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('incorrect data'));
        return;
      }
      next(err);
    });
};

const findUserI = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => next(err));
};

const getlogin = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((users) => {
      const token = jwt.sign({ _id: users._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new AuthErrors('Email or password not corrected'));
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getlogin,
  findUserI,
};
