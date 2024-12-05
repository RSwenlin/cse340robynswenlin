// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/')
const validate = require('../utilities/account-validation')

// Apply checkLogin middleware to make sure the user is logged in for certain routes
router.get('/login', utilities.handleErrors(accountController.buildLogin))

/* *******************
*   Login process
*   **************** */
router.post(
    '/login',
    validate.loginRules(),
    validate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.get('/logout', accountController.accountLogout)  // Logout route
// routes/accountRoute.js
router.get('/logout', accountController.logout);


 /* ***********************
*   Registration View
*   Unit 4, deliver registration view
*   ********************** */
router.get('/register', utilities.handleErrors(accountController.buildRegister))

/* ***********************
*   Process Registration
*   ********************** */
router.post('/register',
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

/* ***********************
*   Account Management
*   ********************** */
router.get('/',
    utilities.checkLogin,        
    utilities.checkAccountType,  
    utilities.handleErrors(accountController.accountManagement)) 

router.post('/',
    utilities.handleErrors(accountController.accountManagement))

// Route to get the update account view
router.get('/update', utilities.checkLogin, accountController.updateAccountView);

// Route to update account data
router.post('/update', 
  validate.updateAccountRules(), 
  validate.handleValidationErrors,
  accountController.updateAccount
);

// Route to change password
router.post('/change-password', 
  validate.changePasswordRules(), 
  validate.handleValidationErrors,
  accountController.changePassword
);


module.exports = router
