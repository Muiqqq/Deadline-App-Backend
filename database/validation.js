const schemas = require('./schemas');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

function validation(todo) {
  const validation = validator.validate(todo, schemas.saveSchema);
  if (validation.errors.length > 0) {
    return validation.errors;
  }
  return true;
}

module.exports = validation;
