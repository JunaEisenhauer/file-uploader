module.exports = {
  'development': {
    'username': process.env.DEV_DATABASE_USERNAME,
    'password': process.env.DEV_DATABASE_PASSWORD,
    'database': process.env.DEV_DATABASE_DATABASE,
    'host': process.env.DEV_DATABASE_HOST,
    'dialect': process.env.DEV_DATABASE_DIALECT
  },
  'test': {
    'username': process.env.TEST_DATABASE_USERNAME,
    'password': process.env.TEST_DATABASE_PASSWORD,
    'database': process.env.TEST_DATABASE_DATABASE,
    'host': process.env.TEST_DATABASE_HOST,
    'dialect': process.env.TEST_DATABASE_DIALECT
  },
  'production': {
    'username': process.env.DATABASE_USERNAME,
    'password': process.env.DATABASE_PASSWORD,
    'database': process.env.DATABASE_DATABASE,
    'host': process.env.DATABASE_HOST,
    'dialect': process.env.DATABASE_DIALECT
  }
};
