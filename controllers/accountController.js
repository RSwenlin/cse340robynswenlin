/* *******************************
* Account Controller
*   deliver login view
* ******************************* */
const accountModel = require('../models/account-model')
const utilities = require('../utilities/')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


/* ************
*   Login view
************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render('account/login', {
        title: "Login",
        nav,
    }) 
}
/* ***************************
*   Deliver registration view
*   ************************ */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render('account/register', {
        title: "Register",
        nav,
        errors: null
    }) 
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password
     } = req.body

     // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }


    //if (!account_email || !account_password || !account_firstname || !account_lastname) {
       // req.flash('notice', 'Please fill in all fields.');
      //  return res.status(400).render('account/register', {
        //    title: "Register",
        //    nav,
        //    errors: req.flash('notice'),
      //  });
  //  }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    if (!account_email || !account_password) {
        req.flash("notice", "Please enter both email and password.");
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: req.flash('notice'),
            account_email,
        });
    }


    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        return res.redirect("/account/")
      }
      else {
        req.flash("message notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        })
      }
    } catch (error) {
      throw new Error('Access Forbidden')
    }
  }
  
  /* ****************************************
 * Account Management View
 * ************************************ */
async function accountManagement(req, res) {
    let nav = await utilities.getNav();
    let userData = null;

    // Check if the user is logged in by verifying the JWT token
    if (req.cookies.jwt) {
        try {
            // Decode the JWT token to get user data (account info)
            const decoded = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
            userData = decoded;  // If JWT is valid, set the user data
        } catch (error) {
            // If there's an error verifying the token, treat it as unauthorized
            req.flash('notice', 'Your session has expired. Please log in again.');
            return res.redirect('/login');
        }
    } else {
        // If there's no JWT cookie, the user is not logged in
        req.flash('notice', 'You need to log in first.');
        return res.redirect('/login');
    }

    // Retrieve flash messages
    const flashMessage = req.flash('message')[0];
    const errors = req.flash('errors');

    // Render the account management page, passing user data and flash messages
    res.render('account/accountManagement', {
        title: 'Account Management',
        nav,
        userData,  // Pass user data to the view
        flash: { message: flashMessage },
        errors: errors
    });
}

  


module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    accountManagement
 };