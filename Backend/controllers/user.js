const User = require('../models/users');
const auth = require('../middlewares/auth');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.json({ users });
  }  catch (err) {
    next (err);
  }
}

exports.register = async (req, res, next) => {
  try {
    await User.create(req.body);

    res.json({ message: "User created successfully" });
  } catch (error) {
    next (err);
  }
}
/*TODO: Improve async use*/
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const foundUser = await User.findOne({ email });

      if (!foundUser) {
        return res.json({ message: "User not found, Check E-mail!"});
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

    } catch (err) {
      next (err);
    }
}

exports.update = async (req, res, next) => {
  try {
    if (req.userId === req.params.id) {
      await User.findByIdAndUpdate(req.params.id, req.body);

      res.json({ message: "User successfully updated" });
    } else {
      res.json({ message: "Not Authorized" });
    }
  } catch (err) {
    next (err);
  }
}