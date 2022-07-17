const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const user = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const RequestErr = require('../errors/request-err');
const NotAutErr = require('../errors/not-aut-err');
const ServerErr = require('../errors/server-err');
const ConflictErr = require('../errors/conflict-err');

const getUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((newUser) => {
      const outUser = {
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        _id: newUser._id,
      };
      res.send({ data: outUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        throw new RequestErr(`${fields} не корректно`);
      }
      if (err.code === 11000) {
        throw new ConflictErr('пользователь существует');
      }
      throw new ServerErr('Ошибка сервера');
    })
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  user.findById(req.params.userId)
    .then((newUser) => {
      if (newUser === null) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        return res.send(newUser);
      }
    })
    .catch((err) => next(err));
};

const getUserMe = (req, res, next) => {
  const { _id } = req.user;
  user.findOne(
    { _id },
  )
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => next(err));
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => next(err));
};

const patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newUser) => res.send(newUser))
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  user.findOne({ email }).select('+password')
    .then((userM) => {
      if (!userM) {
        // перейдём в .catch, отклонив промис
        throw new NotAutErr('неверный пользователь или пароль');
      }
      return bcrypt.compare(password, userM.password)
        .then((matched) => {
          if (!matched) {
            throw new NotAutErr('неверный пользователь или пароль');
          }
          return userM;
        });
    })
    .then((data) => {
      res.send({
        token: jwt.sign({ _id: data._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
          expiresIn: '7d',
        }),
      });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUser,
  createUser,
  getUsers,
  patchUser,
  patchAvatar,
  login,
  getUserMe,
};
