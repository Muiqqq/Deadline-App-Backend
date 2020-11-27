const MainObject = {};

MainObject.saveSchema = {
  id: '/All',
  type: 'object',

  properties: {
    name: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 200,
    },
    description: {
      type: 'string',
      maxlength: 400,
    },
    priority: {
      type: 'number',
      required: true,
      minimum: 1,
      maximum: 3,
    },
    listid: {
      type: 'number',
      required: true,
      minimum: 0,
      maximum: 100,
    },
  },
};

MainObject.nameSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 40,
    },
  },
};

module.exports = MainObject;
