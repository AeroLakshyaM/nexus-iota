import { connectToDb } from './mongodb.js';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await connectToDb();
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection(); 