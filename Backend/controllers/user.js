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
// Get user profile
exports.profile = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);

    res.json ({ profile: currentUser });
  } catch (err) {
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
// Update user
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
// Follow user
exports.follow = async (req, res, next) => {
  try {
    const otherUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);
    
    if (!currentUser.following.includes(otherUser.id)) {
      await User.findByIdAndUpdate(currentUser.id, { $push: { followers: otherUser.id } });
      await User.findByIdAndUpdate(otherUser.id, { $push: { following: currentUser.id } });
    }
    
    const profile = {
      username: otherUser.username,
      bio: otherUser.bio,
      image: otherUser.image,
      following: true
    }

    res.json ({ profile });
  } catch (err) {
    next (err);
  }
}
// Unfollow user
exports.unfollow = async (req, res, next) => {
  try {
    const otherUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (currentUser.following.includes(otherUser.id)) {
      // Remove from following list of current user
      currentUser.following.splice(currentUser.following.indexOf(otherUser.id), 1);

      await User.findByIdAndUpdate(currentUser.id, { following: currentUser.following });

      // Remove from followers list of other user
      otherUser.followers.splice(otherUser.followers.indexOf(currentUser.id), 1);

      await User.findByIdAndUpdate(otherUser.id, { followers: otherUser.followers });
    }

    const profile = {
      username: otherUser.username,
      bio: otherUser.bio,
      image: otherUser.image,
      following: false
    }

    res.json ({ profile });
  } catch (err) {
    next (err);
  }
}