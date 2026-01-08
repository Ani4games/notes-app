import { useState, useEffect } from 'react';
import NoteForm from '../components/NoteForm';
import NoteItem from '../components/NoteItem';
import { FiPlus, FiSearch, FiLoader, FiAlertCircle, FiDatabase } from 'react-icons/fi';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [error, setError] = useState(null);
  const [dbStatus, setDbStatus] = useState('checking'); // 'checking', 'connected', 'error'

  // Check database connection on mount
  useEffect(() => {
    checkDatabaseConnection();
    fetchNotes();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchQuery, sortOrder]);

  const checkDatabaseConnection = async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        setDbStatus('connected');
      } else {
        setDbStatus('error');
      }
    } catch (error) {
      setDbStatus('error');
    }
  };

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/notes');
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setNotes(data.data);
      } else {
        setError(data.error || 'Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(error.message || 'Failed to load notes. Please check MongoDB connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // ADDED THIS MISSING FUNCTION
  const filterAndSortNotes = () => {
    let filtered = [...notes];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else if (sortOrder === 'oldest') {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      } else if (sortOrder === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    
    setFilteredNotes(filtered);
  };

  const handleCreateNote = async (noteData) => {
    try {
      setError(null);
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setNotes([data.data, ...notes]);
        setEditingNote(null);
      } else {
        setError(data.error || 'Failed to create note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      setError(error.message || 'Failed to create note');
      throw error;
    }
  };

  const handleUpdateNote = async (noteData) => {
    try {
      setError(null);
      const res = await fetch(`/api/notes/${editingNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setNotes(notes.map(note => 
          note._id === editingNote._id ? data.data : note
        ));
        setEditingNote(null);
      } else {
        setError(data.error || 'Failed to update note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      setError(error.message || 'Failed to update note');
      throw error;
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) return;

    try {
      setError(null);
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.success) {
        setNotes(notes.filter(note => note._id !== noteId));
      } else {
        setError(data.error || 'Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      setError(error.message || 'Failed to delete note');
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            📝 Notes App with MongoDB
          </h1>
          <p className="text-gray-600 text-lg">
            Full-stack application with real database
          </p>
          
          {/* Database Status Indicator */}
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
            <FiDatabase className={`mr-2 ${
              dbStatus === 'connected' ? 'text-green-500' : 
              dbStatus === 'error' ? 'text-red-500' : 'text-yellow-500'
            }`} />
            <span className={
              dbStatus === 'connected' ? 'text-green-700' : 
              dbStatus === 'error' ? 'text-red-700' : 'text-yellow-700'
            }>
              {dbStatus === 'connected' ? '✅ MongoDB Connected' : 
               dbStatus === 'error' ? '❌ MongoDB Connection Error' : 
               '🔄 Checking Database...'}
            </span>
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" />
              <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        <main>
          {editingNote ? (
            <div className="animate-slide-up">
              <NoteForm
                note={editingNote}
                onSubmit={editingNote._id ? handleUpdateNote : handleCreateNote}
                onCancel={handleCancelEdit}
              />
            </div>
          ) : (
            <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button
                onClick={() => setEditingNote({})}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
              >
                <FiPlus className="mr-2" />
                Create New Note
              </button>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-10"
                  />
                </div>
                
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center">
                <FiLoader className="animate-spin h-12 w-12 text-blue-500 mr-4" />
                <div>
                  <p className="text-xl font-semibold text-gray-700">Loading your notes...</p>
                  <p className="text-gray-500 mt-2">Please wait a moment</p>
                </div>
              </div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-gray-300 text-8xl mb-6">📄</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                {searchQuery ? 'No matching notes found' : 'No notes yet'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchQuery 
                  ? 'Try a different search term or create a new note'
                  : 'Get started by creating your first note!'}
              </p>
              {!editingNote && (
                <button
                  onClick={() => setEditingNote({})}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Create Your First Note
                </button>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Your Notes <span className="text-blue-500">({filteredNotes.length})</span>
                </h2>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear search
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => (
                  <NoteItem
                    key={note._id}
                    note={note}
                    onEdit={setEditingNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500">
            <span className="font-semibold">Full-stack Notes App</span> • Built with Next.js, MongoDB & Tailwind CSS
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Create, edit, and manage your notes seamlessly
          </p>
        </footer>
      </div>
    </div>
  );
}