const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  getUpdateUserAvatar,
  getUpdateUserInfo,
} = require('../controllers/users');

router.get('/:id', getUser);
router.post('/', createUser);
router.get('/', getUsers);
router.patch('/me/avatar', getUpdateUserAvatar);
router.patch('/me', getUpdateUserInfo);

module.exports.userRouter = router;
