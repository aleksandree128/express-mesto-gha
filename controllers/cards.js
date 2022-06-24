const Card = require('../models/card');
const NotFoundErrors = require('../codes__errors/notFound-errors');
const ReqErrors = require('../codes__errors/req-errors');

const getCard = (req, res, next) => {
  Card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  Card
    .findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundErrors('Card not found');
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
      throw new ReqErrors('Невозможно удалить карту других пользователей');
    })
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  if (!name || !link) {
    throw new ReqErrors('data is not corrected');
  }
  Card
    .create({ name, link, owner })
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
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((cards) => {
      if (cards === null) {
        NotFoundErrors('Card not found');
        return;
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ReqErrors('id неверен'));
        return;
      }
      next(err);
    });
};

const disLikeCard = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((cards) => {
      if (cards === null) {
        res.status(404).send({ message: ' Card not found' });
        return;
      }
      res.send({ data: cards });
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
  getCard, createCard, deleteCard, disLikeCard, likeCard,
};
