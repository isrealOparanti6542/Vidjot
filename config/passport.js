const LocalStrategy = require('passport-local')
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const { findOne } = require('../models/Users')
 

//Load User Model
require('../models/Users')
const User  = mongoose.model('users')

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
        //Match User
      User.findOne({
        email: email
      }).then((user) => {
        if(!user){
            //done=null/user/message that will be send
            return done(null, false, {message: "No User Found"})
        }

        //Match Password
        bcrypt.compare(password, user.password, (err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                return done(null, user)
            }else{
                return done(null, false, {message: "Password Incorrect"})
            }
        })
      })
    }));
    passport.serializeUser(function(user, done){
        done(null, user.id)
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });
    });
    
}