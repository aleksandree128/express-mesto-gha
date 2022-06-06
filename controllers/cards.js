const card = require('../models/card');

const getCard = (req, res) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

const deleteCard = (req, res) => {
  card
    .findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (card === null) {
        res.status(404).send({ message: 'Card not found' });
        return;
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Id is not correct' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  card
    .create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        res.status(400).send({ message: `${fields} is not corrected` });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const likeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((cards) => {
      if (card === null) {
        res.status(404).send({ message: 'Card not found' });
        return;
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Id is not correct' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const disLikeCard = (req, res) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((cards) => {
      if (card === null) {
        res.status(404).send({ message: ' Card not found' });
        return;
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Id is not correct' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

module.exports = {
  getCard, createCard, deleteCard, disLikeCard, likeCard,
};
