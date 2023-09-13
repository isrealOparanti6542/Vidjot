const express = require('express')
const router = express.Router();
const mongoose = require("mongoose")

const { ensureAuthenticated } = require('../helpers/auth')

require('../models/Ideas')
const Idea = mongoose.model('ideas')

// Idea index page
router.get('/', ensureAuthenticated, (req, res)=>{
    Idea.find({user: req.user.id})
    .sort({date: "desc"})
    .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas.map(ideas => ideas.toObject())
        })
   })
 })
// Add idea form
 router.get('/add', ensureAuthenticated, (req, res)=>{
    res.render('ideas/add')
 })
//  Edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    const ideaId = req.params.id.toString(); // Convert ObjectId to string
    Idea.findOne({
      _id: ideaId
    })
    .then(idea => {
      if(idea.user != req.user.id){
        req.flash('error_msg', "Not Authorized")
        res.redirect('/ideas');
      }else{
        // Convert the idea to a plain JavaScript object
        const ideaObject = idea.toObject();
  
        res.render('ideas/edit', {
          idea: ideaObject
        });
      }
   })  
  });
      

 //Process Form 
 router.post('/', ensureAuthenticated, (req, res)=>{
    const { title, details } = req.body
    let errors = [];
    if(!title){
        errors.push({text: "Please add a title"})
    }
     if(!details){
        errors.push({text: "Please add some details"})
    }
    if(errors.length > 0){
       res.render('ideas/add', {
            errors: errors,
            title: title,
            details: details
       })
    }else{
        const newUser = {
            title: title,
            details: details,
            user: req.user.id
        }
        new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg', 'Video idea added')
            res.redirect("/ideas")
        })
    }
 
 })

 //Edit form process
 router.put('/:id', ensureAuthenticated, (req, res) => {
    const { id } = req.params;
    const { title, details } = req.body; // Access title and details from the request body
  
    Idea.findOne({
      _id: id
    })
      .then(idea => {
        idea.title = title;
        idea.details = details;
  
        idea.save()
          .then(idea => {
            req.flash('success_msg', 'Video idea edited')
            res.redirect('/ideas');
          })
          .catch(error => {
            console.error('Error saving idea:', error);
            res.status(500).send('Internal Server Error');
          });
      })
      .catch(error => {
        console.error('Error fetching idea:', error);
        res.status(500).send('Internal Server Error');
      });
  });
// Delete Idea
   router.delete('/:id', ensureAuthenticated, (req, res) => {
    const { id } = req.params;

    Idea.deleteOne({ _id: id })
        .then(() => {
        req.flash('success_msg', 'Video idea removed')
        res.redirect('/ideas');
    })
  });


  
module.exports = router