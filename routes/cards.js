const router = require('express').Router()
const {
  getCard,
  getDeleteCard,
  createCard,
  likeCard,
  disLikeCard
} = require('../controllers/cards')

router.get('/cards/:id', getCard )
router.post('/cards', createCard)
router.delete('/cards/:cardId', getDeleteCard)
router.delete('/cards/:cardId/likes', disLikeCard);
router.patch('/cards/me', likeCard);

module.exports.cardRouter = router