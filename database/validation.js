const schemas = require('./schemas');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

function validation(obj) {
  let validationErrors;
  // Checking whether it is todo or list to be validated is a bit clunky
  // Now it just checks if obj has key 'priority' that only todos have
  const validation = obj.priority
    ? validator.validate(obj, schemas.todoSchema)
    : validator.validate(obj, schemas.listSchema);

  if (validation.errors.length > 0) {
    validationErrors = validation.errors;
  }
  return validationErrors;
}

module.exports = validation;
