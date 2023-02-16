module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', process.env.HOST),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', process.env.DB_NAME),
      user: env('DATABASE_USERNAME', process.env.DB_USER),
      password: env('DATABASE_PASSWORD', process.env.DB_PASS),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
