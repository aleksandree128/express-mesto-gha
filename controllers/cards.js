const Card = require('../models/card');
const NotFoundErrors = require('../code_errors/notFound-errors');
const ReqErrors = require('../code_errors/req-errors');
const ForbiddenErrors = require('../code_errors/forbidden-errors');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErrors('incorrect data'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).then((card) => {
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
            next(new ReqErrors('incorrect data'));
            return;
          }
          next(err);
        });
      return;
    }
    throw new ForbiddenErrors('It is not possible to delete the card of other users');
  })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (cards === null) {
        throw new NotFoundErrors('Card not found');
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ReqErrors('id incorrect'));
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
    .then((cards) => {
      if (cards === null) {
        throw new NotFoundErrors('Card not found');
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ReqErrors('id incorrect'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  dislikeCard,
  likeCard,
};
