const MainObject = {};

MainObject.saveSchema = {
  id: '/All',
  type: 'object',

  properties: {
    name: {
      type: 'string',
      minlength: 1,
      maxlength: 400,
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

MainObject.idSchema = {
  type: 'number',
  minimum: 1,
};

module.exports = MainObject;
