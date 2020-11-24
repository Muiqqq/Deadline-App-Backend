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
  save: (location, callback) => {},
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
  deleteById: (id, callback) => {},
  findById: (id, callback) => {},
};

module.exports = connectionFunctions;
