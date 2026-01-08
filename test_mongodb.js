const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testMongoDB() {
  console.log('🧪 Testing MongoDB Connection...');
  console.log('🔗 Connection URI:', process.env.MONGODB_URI || 'Not set');
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notesapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Create Note schema for testing
    const NoteSchema = new mongoose.Schema({
      title: String,
      content: String,
    }, { timestamps: true });
    
    const Note = mongoose.model('TestNote', NoteSchema);
    
    // Test CRUD operations
    console.log('\n🧪 Testing CRUD operations...');
    
    // 1. Create
    const testNote = await Note.create({
      title: 'Test Note from Script',
      content: 'This is a test note created by the test script.',
    });
    console.log(`✅ Created note: ${testNote.title} (ID: ${testNote._id})`);
    
    // 2. Read
    const foundNote = await Note.findById(testNote._id);
    console.log(`✅ Found note: ${foundNote.title}`);
    
    // 3. Update
    const updatedNote = await Note.findByIdAndUpdate(
      testNote._id,
      { title: 'Updated Test Note' },
      { new: true }
    );
    console.log(`✅ Updated note: ${updatedNote.title}`);
    
    // 4. Delete
    await Note.findByIdAndDelete(testNote._id);
    console.log(`✅ Deleted note`);
    
    // Count remaining notes
    const noteCount = await Note.countDocuments();
    console.log(`📊 Total notes in database: ${noteCount}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ All tests passed! MongoDB is working correctly.');
    
  } catch (error) {
    console.error('\n❌ MongoDB Test Failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Troubleshooting Tips:');
      console.log('1. Make sure MongoDB is running:');
      console.log('   - Open Services (services.msc)');
      console.log('   - Find "MongoDB" service');
      console.log('   - Right-click → Start');
      console.log('\n2. Or start MongoDB manually:');
      console.log('   mongod --dbpath "C:\\data\\db"');
      console.log('\n3. Check if port 27017 is in use:');
      console.log('   netstat -ano | findstr :27017');
      console.log('\n4. Try MongoDB Atlas (cloud):');
      console.log('   - Go to https://www.mongodb.com/cloud/atlas');
      console.log('   - Create free cluster');
      console.log('   - Update .env.local with connection string');
    }
  }
}

testMongoDB();