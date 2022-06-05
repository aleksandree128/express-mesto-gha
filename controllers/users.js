const mongoose = require('mongoose');
const user = require('../models/user');

const getUser = (req, res) => {
  /*if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).send({ message: 'Id is is nor corrected' });
  }*/
  return user
    .findById(req.params.userId)
    // eslint-disable-next-line no-shadow
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: ' User not found' });
      }
      return res.send({ data: user });
    })
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Error name or about or avatar is nor corrected' });
  }
  return user
    .create({ name, about, avatar })
    // eslint-disable-next-line no-shadow
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'are not correct' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const getUsers = (_, res) => {
  user
    .find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.user === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        return res.status(400).send({ message: `${fields} user don't serch` });
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const getUpdateUserInfo = (req, res) => {
  const { name, about } = req.body;
  user
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    // eslint-disable-next-line consistent-return,no-shadow
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: ' User not found' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.about === 'ValidationError') {
        return res.status(400).send({ message: 'date not correct' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const getUpdateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(req.user._id, { avatar }, {
      new: true,
      runValidators: true,
    })
    // eslint-disable-next-line consistent-return,no-shadow
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'date not correct' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

module.exports = {
  getUser,
  createUser,
  getUsers,
  getUpdateUserInfo,
  getUpdateUserAvatar,
};
