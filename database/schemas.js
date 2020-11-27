const MainObject = {};

MainObject.saveSchema = {
  id: '/All',
  type: 'object',

  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 200,
    },
    description: {
      type: 'string',
      maxlength: 400,
    },
    priority: {
      type: 'number',
      minimum: 1,
      maximum: 3,
    },
    listid: {
      type: 'number',
      minimum: 0,
      maximum: 100,
    },
  },
};

MainObject.nameSchema = {
  type: 'string',
  minlength: 1,
  maxlength: 3,
};

module.exports = MainObject;
