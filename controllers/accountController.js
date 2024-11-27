/* *******************************
* Account Controller
*   deliver login view
* ******************************* */
const utilities = require('../utilities')

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


module.exports = { buildLogin, buildRegister };