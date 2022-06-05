const router = require('express').Router()
const {
  getUser,
  getUsers,
  createUser,
  getUpdateUserAvatar,
  getUpdateUserInfo
} = require('../controllers/users')

router.get('/users/:id', getUser )
router.post('/users', createUser)
router.get('/users', getUsers)
router.patch('/me/avatar', getUpdateUserAvatar);
router.patch('/me', getUpdateUserInfo);

module.exports.userRouter = router