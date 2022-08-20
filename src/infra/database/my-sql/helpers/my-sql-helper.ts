import knex, { Knex } from 'knex';

export const MySQLHelper = {
  connection: {} as Knex<any, unknown[]>,

  async connect(): Promise<void> {
    this.connection = knex({
      client: 'mysql2',
      connection: {
        user: 'root',
        password: 'root123',
        database: 'coffee_shop',
      },
    });
  },

  async disconnect(): Promise<void> {
    this.connection.destroy();
  },
};
