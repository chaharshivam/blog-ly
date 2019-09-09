const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const User = require('../models/users');

passport.use(new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        let user = {
            email: profile.emails[0].value,
            name: profile.displayName,
            photo: profile.photos[0].value,
            username: profile.username
        };
        User.findOne({email: user.email}, (err, foundUser) => {
            if (err) return done(err, false);
            
			if(!foundUser) {
                User.create(user, (err, createdUser) => {
					if (err) return done(err, false);

					return done(null, createdUser);
				});
			}

			return done(null, foundUser);
		});
    }
));