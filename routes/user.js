const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, patchUser, patchAvatar, getUsers, getUserMe,
} = require('../controllers/users');

router.get('/users/me', getUserMe);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUser);
router.get('/users', getUsers);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.([^\d][^\d])))(:\d{2,5})?((\/.+)+)?\/?#?/),
  }),
}), patchAvatar);

module.exports.userRouter = router;
