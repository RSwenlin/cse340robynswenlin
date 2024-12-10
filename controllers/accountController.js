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
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

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

        // Create a JWT token and set it in the cookie
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true in production
          maxAge: 3600 * 1000, // Expires in 1 hour
        });

        // Store session data as logged in
        req.session.loggedin = true;
        req.session.accountData = accountData;

        return res.redirect("/account/")
      } else {
        req.flash("message notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        })
      }
    } catch (error) {
      req.flash("notice", "An error occurred during login.");
      res.status(500).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
}
/* ****************************************
 * Account Management View
 * ************************************ */
async function accountManagement(req, res) {
    let nav = await utilities.getNav();
    let accountData = req.session.accountData || null;  // Use the accountData from the session

    // If the user is not logged in, redirect to login page
    if (!req.session.loggedin) {
        req.flash('notice', 'You need to log in first.');
        return res.redirect('/account/login');
    }

    const flashMessage = req.flash('message')[0];
    const errors = req.flash('errors');

    // Render the account management page
    res.render('account/management', {
        title: 'Account Management',
        nav,
        loggedin: req.session.loggedin,
        accountData: accountData,  // Pass accountData into the view
        flash: { message: flashMessage },
        errors: errors,
    });
}


/* ****************************************
 * Process Logout
 * ************************************ */
async function accountLogout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying session', err)
        return res.redirect('/account');
      }
      console.log('Session destroyed successfully')
      res.clearCookie('jwt'); 
      res.redirect('/account/login'); 
    });
  }

 /* ****************************************
 * update account view
 * ************************************ */

async function updateAccountView(req, res) {
    const accountData = res.locals.accountData
    let nav = await utilities.getNav()
    
    // Ensure user is logged in
    if (!accountData) {
      req.flash('message', 'You need to log in first.');
      return res.redirect('/account/login');
    }
  
    // Render the account update form
    res.render('account/update', {
        nav,
      title: 'Update Account',
      accountData: accountData
    });
  }
  async function updateAccount(req, res) {
    const { firstName, lastName, email, account_id } = req.body;
    const accountData = res.locals.accountData;
  
    try {
      // Check if email already exists
      const existingEmail = await accountModel.getAccountByEmail(email);
      if (existingEmail && existingEmail.id !== account_id) {
        req.flash('errors', 'Email already in use');
        return res.redirect('back');
      }
  
      // Update the account info
      await accountModel.updateAccountInfo(account_id, firstName, lastName, email);
      req.session.accountData.firstName = firstName;
      req.session.accountData.lastName = lastName;
      req.session.accountData.email = email;
  
      req.flash('message', 'Account updated successfully');
      res.redirect('/account');
    } catch (err) {
      console.error(err);
      req.flash('errors', 'Failed to update account');
      res.redirect('back');
    }
  }
  async function changePassword(req, res) {
    const { password, account_id } = req.body;
    
    try {
      // Hash the new password
      const hashedPassword = await utilities.hashPassword(password);
      
      // Update the password in the database
      await accountModel.updatePassword(account_id, hashedPassword);
      
      req.flash('message', 'Password updated successfully');
      res.redirect('/account');
    } catch (err) {
      console.error(err);
      req.flash('errors', 'Failed to change password');
      res.redirect('back');
    }
  }
  // controllers/accountController.js


  

module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    accountManagement,
    accountLogout,
    updateAccountView,
    updateAccount,
    changePassword
};

