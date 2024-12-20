/*******************************************/
/* This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")  // Add this line to require the error route
const utilities = require('./utilities');
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require('./routes/accountRoute')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const reviewRoutes = require("./routes/reviewRoute");



/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
// process registration
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))   //parsing application

// login activity
app.use(cookieParser())
//login process
app.use(utilities.checkJWTToken)


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require('./routes/static'))

// Index route
app.get('/', utilities.handleErrors(baseController.buildHome))


// Inventory routes
app.use('/inv', inventoryRoute)

// Account routes
app.use('/account', utilities.handleErrors(accountRoute))

// Add the new route for the intentional error
app.use('/error', errorRoute)  // Add this line to use the error route

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message;
  if (err.status === 404) {
    message = err.message;
  } else {
    message = 'An unexpected error occurred. Please try again later.';
  }

  res.render('errors/error', {
    title: err.status || 'Server Error',
    message: message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
app.use((req, res, next) => {
  res.locals.accountData = req.user || null; 
  next();
});
// Use the review routes
app.use("/reviews", reviewRoutes);

