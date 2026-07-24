import { MONGO_DB_URI } from '@config/env';
import { ConnectOptions } from 'mongoose';

const options: ConnectOptions = {
  autoCreate: true,
  autoIndex: true,
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
};

export const dbConnection = {
  options,
  url: MONGO_DB_URI as string,
};
