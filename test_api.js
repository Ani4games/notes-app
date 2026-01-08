import mongoose from 'mongoose';


async function testAPI() {
  console.log('🧪 Testing MongoDB and API...');
  
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notesapp';
  console.log('Using MONGODB_URI:', MONGODB_URI);
  
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Define schema
    const NoteSchema = new mongoose.Schema({
      title: String,
      content: String,
      createdAt: Date,
      updatedAt: Date,
    });
    
    // Get or create model
    const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);
    
    // Clear existing data (optional)
    await Note.deleteMany({});
    console.log('✅ Cleared existing notes');
    
    // Create test notes
    const note1 = await Note.create({
      title: 'Test Note 1',
      content: 'This is test note 1',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const note2 = await Note.create({
      title: 'Test Note 2',
      content: 'This is test note 2',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Created test notes:', note1._id, note2._id);
    
    // Fetch all notes
    const allNotes = await Note.find({});
    console.log(`✅ Found ${allNotes.length} notes:`);
    allNotes.forEach((note, i) => {
      console.log(`  ${i + 1}. ${note.title} - ${note.content}`);
    });
    
    // Clean up
    await Note.deleteMany({});
    console.log('✅ Cleaned up test notes');
    
    await mongoose.connection.close();
    console.log('✅ Connection closed');
    console.log('\n🎉 All tests passed! Your database is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
    
    if (error.name === 'MongoServerError') {
      console.log('\n💡 MongoDB Server Error - Check:');
      console.log('1. Run: mongod --dbpath "C:\\data\\db" (as Administrator)');
      console.log('2. Or: net start MongoDB (if installed as service)');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.log('\n💡 Cannot connect to MongoDB - Check:');
      console.log('1. Is MongoDB running?');
      console.log('2. Check: mongosh --eval "db.runCommand({ping: 1})"');
    }
  }
}

testAPI();