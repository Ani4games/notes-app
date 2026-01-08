// // Import the shared mock data
// let mockNotes = [
//   {
//     _id: '1',
//     title: 'Welcome to Notes App! 🎉',
//     content: 'This is your first note! You can create, edit, and delete notes.\n\nFeatures:\n✓ Create new notes\n✓ Edit existing notes\n✓ Delete notes\n✓ Search functionality\n✓ Sort by date or title',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: '2',
//     title: 'Shopping List',
//     content: '🛒 Groceries needed:\n- Milk\n- Eggs\n- Bread\n- Coffee\n- Fruits',
//     createdAt: new Date(Date.now() - 86400000).toISOString(),
//     updatedAt: new Date(Date.now() - 43200000).toISOString(),
//   },
//   {
//     _id: '3',
//     title: 'Project Ideas',
//     content: '💡 Ideas for future projects:\n1. Expense tracker app\n2. Recipe organizer\n3. Habit tracker\n4. Book reading list',
//     createdAt: new Date(Date.now() - 172800000).toISOString(),
//     updatedAt: new Date(Date.now() - 86400000).toISOString(),
//   },
//   {
//     _id: '4',
//     title: 'Meeting Notes',
//     content: '📅 Team Meeting - Monday\n\nAgenda:\n• Project updates\n• Q2 planning\n• Resource allocation\n\nAction Items:\n- John: Prepare presentation\n- Sarah: Update documentation\n- Mike: Test new features',
//     createdAt: new Date(Date.now() - 259200000).toISOString(),
//     updatedAt: new Date(Date.now() - 172800000).toISOString(),
//   },
// ];
import dbConnect from '../../../lib/dbConnect';
import Note from '../../../models/Note';

export default async function handler(req, res) {
  try {
    // Connect to MongoDB
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Database connection failed' 
    });
  }

  const {
    query: { id },
    method,
  } = req;

  // Validate MongoDB ObjectId
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid note ID' 
    });
  }

  switch (method) {
    case 'GET':
      try {
        console.log(`📝 Fetching note with ID: ${id}`);
        const note = await Note.findById(id);
        
        if (!note) {
          return res.status(404).json({ 
            success: false, 
            error: 'Note not found' 
          });
        }
        
        console.log(`✅ Note found: ${note.title}`);
        return res.status(200).json({ success: true, data: note });
      } catch (error) {
        console.error('❌ GET error:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch note' 
        });
      }

    case 'PUT':
      try {
        const { title, content } = req.body;
        
        // Validate input
        if (!title || !title.trim()) {
          return res.status(400).json({ 
            success: false, 
            error: 'Title is required' 
          });
        }
        
        if (!content || !content.trim()) {
          return res.status(400).json({ 
            success: false, 
            error: 'Content is required' 
          });
        }
        
        console.log(`📝 Updating note with ID: ${id}`);
        
        const note = await Note.findByIdAndUpdate(
          id,
          {
            title: title.trim(),
            content: content.trim(),
          },
          {
            new: true, // Return the updated document
            runValidators: true, // Run schema validators
          }
        );
        
        if (!note) {
          return res.status(404).json({ 
            success: false, 
            error: 'Note not found' 
          });
        }
        
        console.log(`✅ Note updated: ${note.title}`);
        return res.status(200).json({ success: true, data: note });
      } catch (error) {
        console.error('❌ PUT error:', error);
        
        if (error.name === 'ValidationError') {
          const errors = Object.values(error.errors).map(err => err.message);
          return res.status(400).json({ 
            success: false, 
            error: errors.join(', ') 
          });
        }
        
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to update note' 
        });
      }

    case 'DELETE':
      try {
        console.log(`📝 Deleting note with ID: ${id}`);
        
        const note = await Note.findByIdAndDelete(id);
        
        if (!note) {
          return res.status(404).json({ 
            success: false, 
            error: 'Note not found' 
          });
        }
        
        console.log(`✅ Note deleted: ${note.title}`);
        return res.status(200).json({ 
          success: true, 
          data: { message: 'Note deleted successfully' } 
        });
      } catch (error) {
        console.error('❌ DELETE error:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to delete note' 
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ 
        success: false, 
        error: `Method ${method} Not Allowed` 
      });
  }
}