import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    trim: true,
  },
}, {
  timestamps: true, // This will automatically add createdAt and updatedAt
});

// If the model already exists, use it; otherwise create a new one
export default mongoose.models.Note || mongoose.model('Note', NoteSchema);