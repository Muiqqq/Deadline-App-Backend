const schemas = require('./schemas');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

function validation(todo) {
  let validationErrors;
  const validation = validator.validate(todo, schemas.saveSchema);
  if (validation.errors.length > 0) {
    validationErrors = validation.errors;
  }
  return validationErrors;
}

module.exports = validation;
