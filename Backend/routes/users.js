const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const auth = require('../middlewares/auth');

/* GET users listing. */
router.get('/', auth.verifyToken, user.getAllUsers);

/* POST a User */
router.post('/', user.register);

/* POST login */
router.post('/login', user.login);

/* PATCH Update User */
router.patch('/:id', auth.verifyToken, user.update);

module.exports = router;