// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/')


router.get('/login', utilities.handleErrors(accountController.buildLogin))
    

    /* ***********************
    *   Registration View
    *   Unit 4, deliver registration view
    *   ********************** */
   
router.get('/register', utilities.handleErrors(accountController.buildRegister))
    /* ***********************
    *   Process Registration
    *   
    *   ********************** */
   
router.post('/register', utilities.handleErrors(accountController.registerAccount))


module.exports = router