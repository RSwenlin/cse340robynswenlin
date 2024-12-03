// Needed Resources 
const express = require("express")
const router = new express.Router() 

const regValidate = require('../controllers/regValidate')
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/')


router.get('/login',
    utilities.handleErrors(accountController.buildLogin))

/* *******************
*   Login process
*   **************** */
router.post(
    '/login',
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

    

 /* ***********************
*   Registration View
*   Unit 4, deliver registration view
*   ********************** */
   
router.get('/register',
    utilities.handleErrors(accountController.buildRegister))
/* ***********************
*   Process Registration
*   
*   ********************** */
   
router.post('/register',
    utilities.handleErrors(accountController.registerAccount))

/* ***********************
*   Account Management
*   
*   ********************** */
    router.get('/',
    utilities.checkLogin,
    utilities.handleErrors(accountController.accountManagement))

    router.post('/',
    utilities.handleErrors(accountController.accountManagement))

module.exports = router