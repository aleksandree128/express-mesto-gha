const Card = require('../models/card');
const NotFoundErrors = require('../codes__errors/notFound-errors');
const ReqErrors = require('../codes__errors/req-errors');
const ForbiddenErrors = require('../codes__errors/forbidden-errors');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).then((card) => {
    if (!card) {
      throw new NotFoundErrors('Карточка не найдена');
    }
    if (req.user._id === card.owner.toString()) {
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.send({ data: card });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new ReqErrors('неверные данные'));
            return;
          }
          next(err);
        });
      return;
    }
    throw new ForbiddenErrors('Невозможно удалить карту других пользователей');
  })
    .catch((err) => next(err));
};

const createCards = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('неверные данные'));
        return;
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundErrors('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ReqErrors('id неверен'));
        return;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundErrors('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ReqErrors('id неверен'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards, createCards, deleteCard, dislikeCard, likeCard,
};
