const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Person = require('./../MODEL/person')
const bcrypt = require('bcrypt')




passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // console.log('Received credential: ', username, password);
        const user = await Person.findOne({ username: username })
        if (!user) {
            console.log('No user found with that username.');
            return done(null, false, { msg: 'Incorrect credentials' });
        }
        const isPasswordmatch = await bcrypt.compare(password, user.password);
        if (isPasswordmatch) {
            return done(null, user)
        } else {
            return done(null, false, { msg: 'Incorerct Password' })
        }
    } catch (err) { 
        return done(err);
    }
}))

module.exports = passport;