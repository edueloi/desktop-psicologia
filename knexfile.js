const path = require('path');

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, 'data', 'db', 'app.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'server', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'server', 'seeds')
    }
  },
  production: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(process.resourcesPath || __dirname, 'data', 'db', 'app.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'server', 'migrations')
    }
  }
};
