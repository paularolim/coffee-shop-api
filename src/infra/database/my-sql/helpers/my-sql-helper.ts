import knex, { Knex } from 'knex';
import env from './env';

export const MySQLHelper = {
  connection: {} as Knex<any, unknown[]>,

  async connect(): Promise<void> {
    this.connection = knex({
      client: 'mysql2',
      connection: {
        user: env.user,
        password: env.password,
        database: env.envName === 'prod' ? env.database : `${env.database}_${env.envName}`,
      },
    });
  },

  async disconnect(): Promise<void> {
    this.connection.destroy();
  },
};
