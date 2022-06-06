const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  updateUserAvatar,
  updateUserInfo,
} = require('../controllers/users');

router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', updateUserAvatar);
router.patch('/users/me', updateUserInfo);

module.exports.userRouter = router;
