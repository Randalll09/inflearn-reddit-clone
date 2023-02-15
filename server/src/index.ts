import { AppDataSource } from './data-source';
import User from './entities/User';

AppDataSource.initialize()
  .then(async () => {})
  .catch((error) => console.log(error));
