import { MySQLHelper } from '../infra/database/my-sql/helpers/my-sql-helper';
import { app } from './config/app';
import env from './config/env';

MySQLHelper.connect()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  })
  .catch(console.error);
