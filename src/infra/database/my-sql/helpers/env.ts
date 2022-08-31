export default {
  envName: process.env.NODE_ENV || 'dev',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root123',
  database: process.env.DATABASE_NAME || 'coffee_shop',
};
