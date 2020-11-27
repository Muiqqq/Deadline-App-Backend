const schemas = require('./schemas');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

function validation(obj) {
  let validationErrors;
  const validation = obj.priority
    ? validator.validate(obj, schemas.todoSchema)
    : validator.validate(obj, schemas.listSchema);

  if (validation.errors.length > 0) {
    validationErrors = validation.errors;
  }
  return validationErrors;
}

module.exports = validation;
