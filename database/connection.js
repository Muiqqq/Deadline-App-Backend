const mysql = require('mysql');
const config = require('./config');

config.connectionLimit = 10;

let connection = null;

const dbConnectionFunctions = {
  // connection: connection,
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
  getConnection: (cb) => {
    connection.getConnection(cb);
  },
};

// module.exports.connection = connection;
module.exports = dbConnectionFunctions;
