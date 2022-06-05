const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  getUpdateUserAvatar,
  getUpdateUserInfo,
} = require('../controllers/users');

router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', getUpdateUserAvatar);
router.patch('/users/me', getUpdateUserInfo);

module.exports.userRouter = router;
