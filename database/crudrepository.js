const mysql = require('mysql');
const config = require('./config.js');
const schemas = require('./schemas.js');

const Validator = require('jsonschema').Validator;
const validator = new Validator();

config.connectionLimit = 10;

let connection = null;

const connectionFunctions = {
  connect: () => {
    // Create connection pool
    connection = mysql.createPool(config);
    // For testing:
    connection.on('acquire', function (connection) {
      console.log('Connection %d acquired', connection.threadId);
    });
  },
  close: () => {
    return new Promise((resolve, reject) => {
      if (connection) {
        // End connection and inform the user that the connection has been closed
        connection.end();
        resolve('Connection closed.');
      } else {
        // Reject if not connected to database
        reject(new Error('Connect to database first!'));
      }
    });
  },
  save: (todo) => {
    return new Promise((resolve, reject) => {
      // Get connection from connection pool
      connection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
        // Validate input
        const validation = validator.validate(todo, schemas.saveSchema);
        if (validation.errors.length > 0) {
          reject(validation.errors);
        } else {
          // Save to database
          const queryString =
            'INSERT INTO todos(date_created, name, description, priority, listid) VALUES (?, ?, ?, ?, ?)';
          connection.query(
            queryString,
            [
              todo.date_created,
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
              resolve(`Saved to database!`);
            }
          );
        }
        // Release connection after use
        connection.release();
      });
    });
  },
  findAll: () => {
    return new Promise((resolve, reject) => {
      // Get connection from connection pool
      connection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
        // Get all rows from table todos
        connection.query('SELECT * FROM todos', (err, data) => {
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
      connection.getConnection(function (err, connection) {
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
      connection.getConnection(function (err, connection) {
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
      connection.getConnection((err, connection) => {
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
