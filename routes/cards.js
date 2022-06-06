const router = require('express').Router();
const {
  getCard,
  deleteCard,
  createCard,
  likeCard,
  disLikeCard,
} = require('../controllers/cards');

router.get('/cards/', getCard);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.delete('/cards/:cardId/likes', disLikeCard);
router.put('/cards/:cardId/likes', likeCard);

module.exports.cardRouter = router;
