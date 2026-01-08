// Create a reset script reset-db.js
require('dotenv').config({ path: '.env.local' });
import { connect, connection, model, Schema } from 'mongoose';

async function resetDatabase() {
  try {
    await connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notesapp');
    console.log('✅ Connected to MongoDB');
    
    // Drop the notes collection
    await connection.db.dropCollection('notes');
    console.log('✅ Dropped notes collection');
    
    // Create fresh collection with sample data
    const Note = model('Note', new Schema({
      title: String,
      content: String,
      createdAt: Date,
      updatedAt: Date,
    }));
    
    await Note.create({
      title: 'Welcome to Notes App',
      content: 'This is your first note! You can edit or delete it.',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await Note.create({
      title: 'Second Note',
      content: 'This is another example note. Try creating your own!',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Created sample notes');
    console.log('✅ Database reset complete!');
    
    await connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

resetDatabase();