const mysql = require('mysql');
const config = require('./config.js');

let connection = null;

const connectionFunctions = {
  connect: () => {
    connection = mysql.createConnection(config);
  },
  close: () => {
    return new Promise((resolve, reject) => {
      // Check if connected to database (connection not null)
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
      // Check if connected to database (connection not null)
      if (connection) {
        // Save to database
        const queryString =
          'INSERT INTO todos(name, description, priority, listid) VALUES (?, ?, ?, ?)';
        connection.query(
          queryString,
          [todo.name, todo.description, todo.priority, todo.listid],
          (err, data) => {
            if (err) {
              reject(err);
            }
            // Resolve and output the id of the new entry
            resolve(`Saved to database!`);
          }
        );
        // Reject if not connected to database
      } else {
        reject(new Error('Connect to database first!'));
      }
    });
  },
  findAll: () => {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.query('SELECT * FROM todos', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(JSON.stringify(data)));
          }
        });
      } else {
        reject(new Error('Connect to database first.'));
      }
    });
  },
  deleteById: (id) => {
    return new Promise((resolve, reject) => {
      // Check if connected to database (connection not null)
      if (connection) {
        // Delete the given id from database
        connection.query(
          'DELETE FROM todos WHERE id = ?',
          [id],
          (err, data) => {
            if (err) {
              reject(err);
              // Check if affectedRows is 1 i.e. the id existed and was removed
            } else if (data.affectedRows === 1) {
              resolve('data');
            } else {
              reject(err);
            }
          }
        );
        // Reject if not connected to database
      } else {
        reject(new Error('Connect to database first!'));
      }
    });
  },
  findById: (id, callback) => {},
};

module.exports = connectionFunctions;
