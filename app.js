const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('/', (req, res) => {
  res.status(404).send({ message: 'not found 404' });
});

app.listen(PORT);
