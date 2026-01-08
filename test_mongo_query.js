require('dotenv').config({ path: '.env.local' });
import { connect, Schema, model, connection } from 'mongoose';

async function testMongoDB() {
  console.log('🧪 Testing MongoDB connection and queries...');
  console.log('MONGODB_URI:', process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notesapp');
  
  try {
    // Connect to MongoDB
    await connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notesapp');
    console.log('✅ Connected to MongoDB');
    
    // Define Note schema (same as in models/Note.js)
    const NoteSchema = new Schema({
      title: String,
      content: String,
      createdAt: Date,
      updatedAt: Date,
    });
    
    const Note = model('Note', NoteSchema);
    
    // Test 1: Create a test note
    console.log('\n📝 Creating test note...');
    const testNote = await Note.create({
      title: 'Test Note from Script',
      content: 'This is a test note created by the test script',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Test note created:', testNote._id);
    
    // Test 2: Find all notes
    console.log('\n🔍 Finding all notes...');
    const allNotes = await Note.find({});
    console.log(`✅ Found ${allNotes.length} notes`);
    allNotes.forEach((note, i) => {
      console.log(`  ${i + 1}. ${note.title} (${note._id})`);
    });
    
    // Test 3: Delete test note
    console.log('\n🗑️  Cleaning up test note...');
    await Note.deleteOne({ _id: testNote._id });
    console.log('✅ Test note deleted');
    
    // Close connection
    await connection.close();
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Error details:', error);
    
    if (error.name === 'MongoServerError') {
      console.log('\n💡 MongoDB Server Error - Check:');
      console.log('1. Is MongoDB running?');
      console.log('2. Is the connection string correct?');
      console.log('3. Can you connect with MongoDB Compass or mongosh?');
    }
  }
}

testMongoDB();