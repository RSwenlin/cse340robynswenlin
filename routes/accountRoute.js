const express = require("express");
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const validate = require('../utilities/account-validation');

// Apply checkLogin middleware to make sure the user is logged in for certain routes
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Login process
router.post(
    '/login',
    validate.loginRules(),
    validate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

// Logout route
router.get('/logout', accountController.accountLogout);  // Logout route

// Registration View
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Process Registration
router.post('/register',
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Account Management (Main route for logged-in users)
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.accountManagement));

// Update Account View
router.get('/update/:account_id', utilities.checkLogin, accountController.updateAccountView);

// Update Account Data
router.post('/update', 
    validate.updateAccountRules(), 
    validate.checkAccountUpdate,
    accountController.updateAccount
);

// Change Password
router.post('/change-password', 
    validate.changePasswordRules(), 
    //validate.handleValidationErrors,
    accountController.changePassword
);

// Handle Account Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('jwt'); // If using JWT
        res.redirect('/account/login'); // Redirect to login page after logout
    });
});

module.exports = router;

