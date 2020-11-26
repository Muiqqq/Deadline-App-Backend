const schemas = require('./schemas.js');
const dbConnection = require('./connection');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

const MAX_ROWS_SHOWN = 80;

const connectionFunctions = {
  // Add a new entry to db
  save: async (context) => {
    // Implement validation!!
    console.log(context);
    const sql = 'INSERT INTO todos SET ?';
    const placeholders = [context];

    const result = await dbConnection.runQuery(sql, placeholders);
    return result;
  },

  // Find all or find one
  find: async (context) => {
    let sql = 'SELECT * FROM todos';
    let placeholders = [];

    if (context.id > 0) {
      sql = sql.concat(' WHERE id = ?');
      placeholders = [context.id];
    } else {
      const limit = context.limit > 0 ? context.limit : MAX_ROWS_SHOWN;
      sql = sql.concat(' LIMIT ?');
      if (context.offset) {
        sql = sql.concat(' OFFSET ?');
      }

      placeholders = [limit, context.offset];
    }

    const result = await dbConnection.runQuery(sql, placeholders);
    return result;
  },
  deleteById: async (context) => {
    const sql = 'DELETE FROM todos WHERE id = ?';
    const placeholders = [context.id];

    const result = await dbConnection.runQuery(sql, placeholders);
    return result;
  },
  update: async (context) => {
    const sql = 'UPDATE todos SET ? WHERE id = ?';
    const placeholders = [context.todo, context.id];

    const result = await dbConnection.runQuery(sql, placeholders);
    return result;
  },
};
module.exports = connectionFunctions;
