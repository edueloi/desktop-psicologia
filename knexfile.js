const path = require('path');

// Função para obter o diretório de dados correto
function getDataDir() {
  if (process.env.PORTABLE_EXECUTABLE_DIR) {
    return process.env.PORTABLE_EXECUTABLE_DIR;
  }
  if (process.env.NODE_ENV === 'production' && process.resourcesPath) {
    return path.join(path.dirname(process.resourcesPath), 'data');
  }
  return path.join(__dirname, 'data');
}

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, 'data', 'db', 'app.db')
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => {
        conn.pragma('encoding = "UTF-8"');
        cb();
      }
    },
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
      filename: path.join(getDataDir(), 'db', 'app.db')
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => {
        conn.pragma('encoding = "UTF-8"');
        cb();
      }
    },
    migrations: {
      directory: path.join(__dirname, 'server', 'migrations')
    }
  }
};
