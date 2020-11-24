const mysql = require('mysql');
const config = require('./config.js');

config.connectionLimit = 10;

let connection = null;

const connectionFunctions = {
  connect: () => {
    connection = mysql.createPool(config);
    connection.on('acquire', function (connection) {
      console.log('Connection %d acquired', connection.threadId);
    });
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
      connection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
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
        connection.release();
      });
    });
  },
  findAll: () => {
    return new Promise((resolve, reject) => {
      connection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
        connection.query('SELECT * FROM todos', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(JSON.stringify(data)));
          }
        });
        connection.release();
      });
    });
  },
  deleteById: (id) => {
    return new Promise((resolve, reject) => {
      // Check if connected to database (connection not null)
      connection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
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
        connection.release();
      });
    });
  },
  findById: (id) => {
    return new Promise((resolve, reject) => {
      // Check if connected to database (connection not null)
      connection.getConnection(function (err, connection) {
        if (err) reject(new Error(err));
        // Find the given id from database
        connection.query(
          'SELECT * FROM todos WHERE id = ?',
          [id],
          (err, locs) => {
            if (err) {
              reject(err);
            }
            if (locs.length > 0) {
              if (locs) {
                resolve(JSON.parse(JSON.stringify(locs)));
              }
            } else {
              reject(new Error('No such id.'));
            }
          }
        );
        // Reject if not connected to database
        connection.release();
      });
    });
  },
};
module.exports = connectionFunctions;
