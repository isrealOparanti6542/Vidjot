const express = require('express');
const { engine }= require("express-handlebars")
const methodOverride = require("method-override") 
const flash = require('connect-flash')
const session = require('express-session')
const mongoose = require("mongoose")
const passport = require('passport')
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

//Load routes
const ideas  = require("./routes/ideas")
const users  = require("./routes/users")

// Passport Congig
require('./config/passport')(passport)

// Map Global promise to get rid of warning
mongoose.Promise = global.Promise;

//DB config
const db = require('./config/database');

 mongoose.connect(db.mongoURI,{
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true,
 })
 .then(()=> console.log("mongodb connected"))
 .catch(err => console.log(err))
//load idea model
require('./models/Ideas')
const Idea = mongoose.model('ideas')
// handlebars middleware
app.engine("handlebars", engine({ defaultLayout: "main"}));
app.set("view engine", 'handlebars');

//Middlewares
app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

//Express session middleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

//Passport middlewars
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

//Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next()
})

//home route
app.get('/',  (req, res)=>{
   const title = "Welcome!"
   res.render('index', {title})
})

//about route
app.get('/about', (req, res)=>{
    res.render('about')
 })

 //idea index page
app.use('/ideas', ideas);
app.use('/users', users);

const PORT = process.env.PORT || 5000;
  app.listen(PORT, function(){
    console.log(`Server stated on port 5000`)
})