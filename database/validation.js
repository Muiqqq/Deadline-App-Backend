const schemas = require('./schemas');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

// const validation = validator.validate(id, schemas.idSchema);
//       if (validation.errors.length > 0) {
//         reject(validation.errors);
//       } else {
