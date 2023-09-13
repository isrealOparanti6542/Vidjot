const express = require('express')
const router = express.Router();
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const passport = require('passport')

//Load User Model
require('../models/Users')
const User  = mongoose.model('users')
// /User login route
router.get("/login", (req, res)=>{
    res.render("users/login")
  })
  
  ///User Register route
  router.get("/register", (req, res)=>{
    res.render("users/register")
  })
//Login form post
  router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
  })

  ///Register form Post
  router.post("/register", (req, res)=>{
    const {password, password2, name, email } = req.body
    let errors = [];
      if(password !== password2) errors.push({text: "Password do not match"})
      if(password.length < 4) errors.push({text: "Password must be atleast 4"})

      if(errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        })
      }else{
        User.findOne({email: email})
        .then(users =>{
            if(users){
                req.flash('error_msg', "This email already exist");
                res.redirect('/users/register')
            }else{
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                })         
                 bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                       try {
                         newUser.password = hash
                         newUser.save()
                         .then(users => {
                            req.flash('success_msg', 'you are now registered and can log in')
                            res.redirect('/users/login');
                         })
                       } catch (error) {
                        res.status(500).json(error)
                       }      
                    })
                 })
            }
        })
        
      }
    
  })

//Logout User

router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash("success_msg", "You have successfully logged out");
    res.redirect('/users/login');
  });
});

 module.exports = router;
