const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String, // имя — это строка
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [], // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
  createdAt: {
    type: Date,
    default: Date.now, // оно должно быть у каждого пользователя, так что имя — обязательное поле
  },
});
module.exports = mongoose.model('card', cardSchema);
