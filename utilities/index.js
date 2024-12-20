const invModel = require("../models/inventory-model")
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  try {
  let data = await invModel.getClassifications()
  let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';

    data.forEach((row) => {
      list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
    });

    list += "</ul>";
    return list;
  } catch (err) {
    console.error("Error:", err);
    return "<ul><li>Error loading navigation</li></ul>";
  }
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  Util.buildVehicleHTML = async function(vehicle)  {
    return `
        <div class="vehicle-detail">
            <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
            <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
            <p>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
            <p>Mileage: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
            <p>Description: ${vehicle.inv_description}</p>
        </div>
    `;
};

Util.buildClassificationList = async function () {
  try {
    const data = await invModel.getClassifications();
    let list = "<select name='classification_id' id='classificationSelect'>";
    list += `<option value="">Select a Classification</option>`;
    data.forEach((row) => {
      list += `<option value="${row.classification_id}">${row.classification_name}</option>`;
    });
    list += "</select>";
    return list;
  } catch (err) {
    console.error("Error building classification list:", err);
    return "<select><option>Error loading classifications</option></select>";
  }
};



/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

// Middleware to check token validity and account type
Util.checkAccountType = (req, res, next) => {
  if (req.cookies.jwt) {
      jwt.verify(
          req.cookies.jwt,
          process.env.ACCESS_TOKEN_SECRET,
          function (err, accountData) {
              if (err) {
                  req.flash("notice", "Please log in.");
                  res.clearCookie("jwt");
                  return res.redirect("/account/login");
              }
              // Check if the account type is "Employee" or "Admin"
              if (accountData.account_type === 'Employee' || accountData.account_type === 'Admin') {
                  res.locals.accountData = accountData;
                  res.locals.loggedin = 1;
                  next();
              } else {
                  req.flash("notice", "You do not have permission to access this page.");
                  return res.redirect("/account/login");
              }
          }
      );
  } else {
      next();
  }
}


Util.handleErrors = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



module.exports = Util
