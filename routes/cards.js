const router = require('express').Router();
const {
  getCard,
  getDeleteCard,
  createCard,
  likeCard,
  disLikeCard,
} = require('../controllers/cards');

router.get('/', getCard);
router.post('/', createCard);
router.delete('/:cardId', getDeleteCard);
router.delete('/:cardId/likes', disLikeCard);
router.patch('/:cardId/likes', likeCard);

module.exports.cardRouter = router;
