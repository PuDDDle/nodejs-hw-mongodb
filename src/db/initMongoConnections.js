import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoDB = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGO_DB');

    console.log('Connecting to MongoDB...');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );

    console.log('Mongo connection successfully established!');
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    // Якщо хочеш, можеш залишити тестовий код, щоб перевірити підключення:

    /*
    const testSchema = new mongoose.Schema({
      name: String,
      value: Number,
    });

    const TestModel = mongoose.models.Test || mongoose.model('Test', testSchema);

    const testDoc = new TestModel({ name: 'TestName', value: 42 });
    await testDoc.save();
    console.log('Test document saved:', testDoc);

    const docs = await TestModel.find();
    console.log('All documents:', docs);
    */

    // Не викликаємо mongoose.disconnect() — підключення залишаємо відкритим
  } catch (e) {
    console.error('Error:', e);
  }
};
