const mysql = require('mysql');
const config = require('./config');

config.connectionLimit = 10;

let connection = null;

const dbConnectionFunctions = {
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

  // Extracted from the repositories to reduce code duplication.
  runQuery: (sql, placeholders) => {
    return new Promise((resolve, reject) => {
      connection.getConnection((err, connection) => {
        if (err) reject(new Error(err));
        console.log(...placeholders);
        console.log(sql);
        connection.query(sql, [...placeholders], (err, data) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(data);
          }
        });
        connection.release();
      });
    });
  },
};

module.exports = dbConnectionFunctions;
