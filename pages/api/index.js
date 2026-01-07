import { useState, useEffect } from 'react';
import NoteForm from '../../components/NoteForm';
import NoteItem from '../../components/NoteItem';
import { FiPlus } from 'react-icons/fi';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      if (data.success) {
        setNotes(data.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      const data = await res.json();
      if (data.success) {
        setNotes([data.data, ...notes]);
        setEditingNote(null);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (noteData) => {
    try {
      const res = await fetch(`/api/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      const data = await res.json();
      if (data.success) {
        setNotes(notes.map(note => 
          note._id === editingNote._id ? data.data : note
        ));
        setEditingNote(null);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setNotes(notes.filter(note => note._id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📝 Notes App</h1>
          <p className="text-gray-600">Create, edit, and manage your notes</p>
        </header>

        <main>
          {editingNote ? (
            <NoteForm
              note={editingNote}
              onSubmit={handleUpdateNote}
              onCancel={() => setEditingNote(null)}
            />
          ) : (
            <div className="mb-8">
              <button
                onClick={() => setEditingNote({})}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <FiPlus className="mr-2" />
                Create New Note
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes yet</h3>
              <p className="text-gray-500">Create your first note to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Your Notes ({notes.length})
              </h2>
              {notes.map((note) => (
                <NoteItem
                  key={note._id}
                  note={note}
                  onEdit={setEditingNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Full-stack Notes App • Built with Next.js & MongoDB</p>
        </footer>
      </div>
    </div>
  );
}