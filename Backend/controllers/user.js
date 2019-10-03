const User = require('../models/users');
const auth = require('../middlewares/auth');
const Article = require('../models/articles');

exports.currentUser = async (req, res, next) => {
  try {
    if (req.query.favourites) {
      const { favourites } = await User.findById(req.userId);
      const favs = [];
      favourites.forEach(async (slug, idx) => {
        favs.push(...await Article.find({ slug }));
        if(idx === favourites.length - 1) { return res.json({ favourites: favs }); }
      });

    } else {
      const user = await User.findById(req.userId);
      res.json({ profile: user });
    }

  }  catch (err) {
    next (err);
  }
}
// Get user profile
exports.profile = async (req, res, next) => {
  try {
    console.log('reached');
    const currentUser = await User.findOne({ username: req.params.username }, "-password");

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
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, req.body);

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
    const otherUser = await User.findOne({ username: req.params.username });
    const currentUser = await User.findById(req.userId);
    
    if (!currentUser.following.includes(otherUser.id)) {
      await User.findByIdAndUpdate(currentUser.id, { $push: { following: otherUser.id } });
      await User.findByIdAndUpdate(otherUser.id, { $push: { followers: currentUser.id } });
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
    const otherUser = await User.findOne({ username: req.params.username });
    const currentUser = await User.findById(req.userId);
  
    if (currentUser.following.includes(otherUser.id)) {
      // Remove from following list of current user
      await User.findByIdAndUpdate(currentUser.id, { $pull: { following: otherUser.id }});
      // Remove from followers list of other user
      await User.findByIdAndUpdate(otherUser.id, { $pull: { followers: currentUser.id }});
    }
    // Extract profile of unfollowed user
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