const schemas = require('./schemas.js');
const dbConnection = require('./connection');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

const MAX_ROWS_SHOWN = 80;

const connectionFunctions = {
  save: (todo) => {
    return new Promise((resolve, reject) => {
      // Get connection from connection pool
      dbConnection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
        // Validate input
        const validation = validator.validate(todo, schemas.saveSchema);
        if (validation.errors.length > 0) {
          reject(validation.errors);
        } else {
          // Save to database
          const queryString =
            'INSERT INTO todos(date_created, date_deadline, name, description, priority, listid) VALUES (?, ?, ?, ?, ?, ?)';
          connection.query(
            queryString,
            [
              todo.date_created,
              todo.date_deadline,
              todo.name,
              todo.description,
              todo.priority,
              todo.listid,
            ],
            (err, data) => {
              if (err) {
                reject(err);
              }
              // Resolve and inform the user that query was successful
              const result = { msg: 'Added successfully.', content: todo };
              resolve(result);
            }
          );
        }
        // Release connection after use
        connection.release();
      });
    });
  },
  findAll: (context) => {
    return new Promise((resolve, reject) => {
      // Get connection from connection pool
      dbConnection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
        let sql = 'SELECT * FROM todos LIMIT ?';
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
  deleteById: (id) => {
    return new Promise((resolve, reject) => {
      // Get connection from connection pool
      dbConnection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
        // Validate input
        const validation = validator.validate(id, schemas.idSchema);
        if (validation.errors.length > 0) {
          reject(validation.errors);
        } else {
          // Delete the given id from database
          connection.query(
            'DELETE FROM todos WHERE id = ?',
            [id],
            (err, data) => {
              if (err) {
                reject(err);
                // Check if affectedRows is 1 i.e. the id existed and was removed
              } else if (data.affectedRows === 1) {
                resolve(`Todo deleted with id ${id}`);
              } else {
                reject(new Error(`Error: Could not delete by id.`));
              }
            }
          );
        }
        // Release connection after use
        connection.release();
      });
    });
  },
  findById: (id) => {
    return new Promise((resolve, reject) => {
      // Get connection from connection pool
      dbConnection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
        // Validate input
        const validation = validator.validate(id, schemas.idSchema);
        if (validation.errors.length > 0) {
          reject(validation.errors);
        } else {
          // Find the given id from database
          connection.query(
            'SELECT * FROM todos WHERE id = ?',
            [id],
            (err, data) => {
              if (err) {
                reject(err);
              }
              if (data.length > 0) {
                if (data) {
                  resolve(JSON.parse(JSON.stringify(data)));
                }
              } else {
                reject(new Error(`Not found with id: ${id}`));
              }
            }
          );
        }
        // Release connection after use
        connection.release();
      });
    });
  },
  update: (todo) => {
    return new Promise((resolve, reject) => {
      dbConnection.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          connection.query(
            'UPDATE todos SET date_created = ?, date_deadline = ?, name = ?, description = ?, priority = ?, is_done = ?, listid = ? WHERE id = ?',
            [
              todo.date_created,
              todo.date_deadline,
              todo.name,
              todo.description,
              todo.priority,
              todo.is_done,
              todo.listid,
              todo.id,
            ],
            (err, data) => {
              if (err) {
                reject(err);
              } else {
                const result = { msg: 'Updated successfully.', content: todo };
                resolve(result);
              }
            }
          );
        }
        connection.release();
      });
    });
  },
};
module.exports = connectionFunctions;
