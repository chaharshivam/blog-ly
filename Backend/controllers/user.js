const User = require('../models/users');
const auth = require('../middlewares/auth');

exports.getAllUsers = (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) return next(err);
        
        res.json({ users });
    });
}

exports.register = (req, res, next) => {
    User.create(req.body, (err, createdUser) => {
      if (err) return next(err);
      
      res.status(200).json({ message: "User created successfully" });
    });
}

exports.login = (req, res, next) => {
    const { email, password } = req.body;
  
    User.findOne({ email }, (err, foundUser) => {
      if (err) return next(err);
  
      if (!foundUser) {
        return res.json({ message: "User not found, Check E-mail/Password" });
      }
  
      foundUser.validatePassword(password, (err, isLogged) => {
        if (err) return next(err);
  
        if (isLogged) {
          const token = auth.generateToken({ userId: foundUser.id });
  
          return res.json({ authToken: token });
        } else {
          res.json({ message: "Wrong Email/Password" });
        }
      });
    });
}

exports.update = (req, res, next) => {
  
    if (req.userId === req.params.id) {
      User.findByIdAndUpdate(req.params.id, req.body, (err, updatedUser) => {
        if (err) return next(err);
    
        res.status(200).json({ message: "User successfully updated" });
      });
    } else {
  
      return res.status(401).json({ message: "Not Authorized" });
    }
}