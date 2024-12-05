const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Login Data Validation Rules
 * ***************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

 


/* ******************************
 * Update Inventory Validation Rules
 * ***************************** */
validate.updateInventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide the vehicle make."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide the vehicle model."),
    body("inv_price")
      .isNumeric()
      .withMessage("Please provide a valid price for the vehicle."),
    body("inv_year")
      .isNumeric()
      .withMessage("Please provide the vehicle year."),
    body("inv_miles")
      .isNumeric()
      .withMessage("Please provide the vehicle mileage."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description for the vehicle.")
  ]
}


/* ******************************
 * Check Inventory Update Data
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render("inventory/edit-inventory", {
      title: "Edit Inventory",
      errors: errors.array(),
      nav,
      ...req.body, 
    });
  }
  next();
};
/* ******************************
 * Check account validation
 * ***************************** */

const { check, validationResult } = require('express-validator');

module.exports = {
  updateAccountRules: () => {
    return [
      check('firstName').notEmpty().withMessage('First name is required.'),
      check('lastName').notEmpty().withMessage('Last name is required.'),
      check('email').isEmail().withMessage('Valid email is required.')
    ];
  },

  changePasswordRules: () => {
    return [
      check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
      check('password').matches(/[A-Za-z]/).withMessage('Password must contain letters.'),
      check('password').matches(/\d/).withMessage('Password must contain numbers.')
    ];
  },

  handleValidationErrors: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('errors', errors.array());
      return res.redirect('back');
    }
    next();
  }
};


  
  module.exports = validate