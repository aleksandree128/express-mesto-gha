const user = require('../models/user');

const getUser = (req, res) => user
  .findById(req.params.userId)
  .then((users) => {
    if (!users) {
      res.status(404).send({ message: ' User not found' });
      return;
    }
    res.send({ data: users });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Id is not correct' });
      return;
    }
    res.status(500).send({ message: 'Server error' });
  });

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user
    .create({ name, about, avatar })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'are not correct' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const getUsers = (req, res) => {
  user
    .find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.user === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        res.status(400).send({ message: `${fields} user don't serch` });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const updateUserInfo = (req, res) => {
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
    .then((users) => {
      if (!users) {
        res.status(404).send({ message: ' User not found' });
        return;
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.about === 'ValidationError' || err._id === 'CastError') {
        res.status(400).send({ message: 'data not correct' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  user
    .findByIdAndUpdate(req.user._id, { avatar }, {
      new: true,
      runValidators: true,
    })
    .then((users) => {
      if (!users) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'data not correct' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

module.exports = {
  getUser,
  createUser,
  getUsers,
  updateUserInfo,
  updateUserAvatar,
};
