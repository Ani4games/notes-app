import { FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';

export default function NoteItem({ note, onEdit, onDelete }) {
  return (
    <div className="card mb-4 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800 truncate">{note.title}</h3>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(note)}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1 rounded hover:bg-blue-50"
            title="Edit note"
          >
            <FiEdit size={20} />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
            title="Delete note"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>
      <div className="flex items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
        <FiCalendar className="mr-2" />
        <span className="mr-4">
          Created: {format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}
        </span>
        {note.updatedAt > note.createdAt && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
}