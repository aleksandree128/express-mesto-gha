const mongoose = require('mongoose');
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
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundErrors('Card not found');
      }
      res.send({ data: card });
    })
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  if (!name || !link) {
    throw new ReqErrors('data is not corrected');
  }
  return Card
    .create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
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
    .catch((err) => next(err));
};

const disLikeCard = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    throw new ReqErrors('uncorrected ID');
  }
  return Card
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
    .catch((err) => next(err));
};

module.exports = {
  getCard, createCard, deleteCard, disLikeCard, likeCard,
};
