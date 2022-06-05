const mongoose = require('mongoose');
const card = require('../models/card');

const getCard = (req, res) => {
  card
    .find({})
    .populate('owner')
    // eslint-disable-next-line no-shadow
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

const getDeleteCard = (res, req) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res.status(400).send({ message: 'Id is not correct' });
  }
  return card
    .findByIdAndRemove(req.params.cardId)
    // eslint-disable-next-line no-shadow
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

const createCard = (res, req) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  if (!name || !link) {
    return res.status(400).send({ message: 'Error' });
  }
  return card
    .create({ name, link, owner })
    // eslint-disable-next-line no-shadow
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        return res.status(400).send({ message: `${fields} is not corrected` });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const likeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res.status(400).send({ message: 'Id is not correct' });
  }
  return card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    // eslint-disable-next-line no-shadow
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

const disLikeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res.status(400).send({ message: 'Id is not correct' });
  }
  return card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      {},
    )
    // eslint-disable-next-line no-shadow
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: ' User not found' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

module.exports = {
  getCard, createCard, getDeleteCard, disLikeCard, likeCard,
};
