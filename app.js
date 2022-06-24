const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const NotFoundErrors = require('./codes__errors/notFound-errors');
const { createUser, getLogin } = require('./controllers/users');
const auth = require('./meddlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), getLogin);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.,~#?&//=!]*$)/),
  }),
}), createUser);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('/', (req, res, next) => {
  next(new NotFoundErrors('Извините, страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
