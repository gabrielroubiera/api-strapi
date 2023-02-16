const {ConnectionString} = require('connection-string');
const config = new ConnectionString(process.env.DATABASE_URL);

module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', config.host),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', config.database),
      user: env('DATABASE_USERNAME', config.user),
      password: env('DATABASE_PASSWORD', config.password),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
