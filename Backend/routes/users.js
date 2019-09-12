const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const auth = require('../middlewares/auth');

/* GET users listing. */
router.get('/', auth.verifyToken, user.getAllUsers);

/* GET current user */
router.get('/:id', user.profile);

/* POST a User */
router.post('/', user.register);

/* POST login */
router.post('/login', user.login);

/* PATCH Update User */
router.patch('/:id', auth.verifyToken, user.update);

/* Follow user */
router.put('/:id/follow', auth.verifyToken, user.follow);

/* Unfollow user */
router.delete('/:id/follow', auth.verifyToken, user.unfollow);

module.exports = router;