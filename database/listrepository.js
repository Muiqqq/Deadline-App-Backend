const dbConnection = require('./connection');
const schemas = require('./schemas');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

const MAX_ROWS_SHOWN = 80;

const connectionFunctions = {
  findAll: (context) => {
    return new Promise((resolve, reject) => {
      // Get connection from connection pool
      dbConnection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
        let sql = 'SELECT * FROM lists LIMIT ?';
        const limit = context.limit > 0 ? context.limit : MAX_ROWS_SHOWN;

        if (context.offset) {
          sql = sql.concat(' OFFSET ?');
        }

        // Get all rows from table todos, utilizes pagination if limit &
        // offset are present.
        connection.query(sql, [limit, context.offset], (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(JSON.stringify(data)));
          }
        });
        // Release connection after use
        connection.release();
      });
    });
  },
};

module.exports = connectionFunctions;
