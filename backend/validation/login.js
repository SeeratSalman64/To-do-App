const Validator = require('validator');
const isEmpty = require('is-empty');

const validateLoginInput = (data) => {
    let errors = {};

    // Converting empty fields to empty strings to use validator function
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    //Email validation
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    //Password checking
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = validateLoginInput;