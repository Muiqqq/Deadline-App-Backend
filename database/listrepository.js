const dbConnection = require('./connection');
const schemas = require('./schemas');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

const MAX_ROWS_SHOWN = 80;

const connectionFunctions = {
  find: async (context) => {
    let sql = 'SELECT * FROM lists';
    let placeholders = [];

    if (context.id > 0) {
      sql = sql.concat(' WHERE id = ?');
      placeholders = [context.id];
    } else {
      const limit = context.limit > 0 ? context.limit : MAX_ROWS_SHOWN;

      if (context.offset) {
        sql = sql.concat(' OFFSET ?');
      }

      placeholders = [limit, context.offset];
    }

    const result = await dbConnection.runQuery(sql, placeholders);
    if (result.length > 0) {
      return result;
    } else {
      throw new Error('Query returned no results.');
    }
  },
};

module.exports = connectionFunctions;
