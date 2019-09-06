const express = require('express');
const router = express.Router();
const Users = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Users.find({}, (err, users) => {
    if (err) return next(err);

    res.json({ users });
  });
});

/* POST a User */
router.post('/', function(req, res, next) {
  Users.create(req.body, (err, createdUser) => {
    if (err) return next(err);

    res.status(200).json({ message: "User created successfully" });
  });
});

/* GET login */
router.get('/login', function(req, res, next) {
  const { email, password } = req.body;

  Users.findOne({ email }, (err, foundUser) => {
    if (err) return next(err);

    if (!foundUser) {
      return res.json({ message: "User not found, Check E-mail/Password" });
    }

    foundUser.validatePassword(password, (err, isLogged) => {
      if (err) return next(err);

      if (isLogged) {
        const token = auth.generateJWT({ userID: foundUser.id });

        return res.json({ authToken: token });
      } else {
        res.json({ message: "Wrong Email/Password" });
      }
    });
  });
});

/* PATCH Update User */
router.patch('/:id', function(req, res, next) {
  Users.findByIdAndUpdate(req.params.id, req.body, (err, updatedUser) => {
    if (err) return next(err);

    res.status(200).json({ message: "User successfully updated" });
  });
});
module.exports = router;