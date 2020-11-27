const dbConnection = require('./connection');
const validate = require('./validation');

const MAX_ROWS_SHOWN = 80;

const sortableColumns = [
  'id',
  'name',
  'priority',
  'listid',
  'date_created',
  'date_deadline',
];

const connectionFunctions = {
  // Find all or find one
  find: async (context) => {
    let sql = 'SELECT * FROM todos';
    let placeholders = [];

    if (context.id > 0) {
      sql = sql.concat(' WHERE id = ?');
      placeholders = [context.id];
    } else {
      if (context.sort) {
        let [column, order] = context.sort.split(':');
        if (!sortableColumns.includes(column)) {
          throw new Error('Invalid "sort" column');
        }
        if (order === undefined) {
          order = 'ASC';
        }
        sql = sql.concat(` ORDER BY ${column} ${order}`);
      }
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
  // Add a new entry to db
  save: async (context) => {
    const validationResult = validate(context);
    if (!validationResult > 0) {
      const sql = 'INSERT INTO todos SET ?';
      const placeholders = [context];

      const result = await dbConnection.runQuery(sql, placeholders);
      return result;
    } else {
      return validationResult[0];
    }
  },
  // Delete todo by id
  deleteById: async (context) => {
    const sql = 'DELETE FROM todos WHERE id = ?';
    const placeholders = [context.id];

    const result = await dbConnection.runQuery(sql, placeholders);
    return result;
  },
  // Update todo by id
  update: async (context) => {
    const sql = 'UPDATE todos SET ? WHERE id = ?';
    const placeholders = [context.todo, context.id];

    const result = await dbConnection.runQuery(sql, placeholders);
    return result;
  },
};
module.exports = connectionFunctions;
