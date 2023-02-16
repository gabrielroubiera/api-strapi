module.exports = ({ env }) => ({
  proxy: true,
  url: env('APP_URL'),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
