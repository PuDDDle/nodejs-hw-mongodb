import { initMongoDB } from './db/initMongoConnections.js';
import { setupServer } from './server.js';
import dotenv from 'dotenv';

console.log('MONGODB_USER:', process.env.MONGODB_USER);
console.log('Current working directory:', process.cwd());

dotenv.config();

const bootstrap = async () => {
  await initMongoDB();
  setupServer();
};

bootstrap();
