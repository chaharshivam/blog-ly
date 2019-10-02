const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const auth = require('../middlewares/auth');

/* GET current user */
router.get('/', auth.verifyToken, user.currentUser);

/* GET user profile */
router.get('/:username', user.profile);

/* POST a User */
router.post('/', user.register);

/* POST login */
router.post('/login', user.login);

/* PUT Update User */
router.put('/', auth.verifyToken, user.update);

/* Follow user */
router.put('/:username/follow', auth.verifyToken, user.follow);

/* Unfollow user */
router.delete('/:username/follow', auth.verifyToken, user.unfollow);

module.exports = router;