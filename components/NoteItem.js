import { FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';

export default function NoteItem({ note, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            title="Edit note"
          >
            <FiEdit size={20} />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-200"
            title="Delete note"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{note.content}</p>
      <div className="flex items-center text-sm text-gray-500">
        <FiCalendar className="mr-1" />
        <span>
          Created: {format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}
          {note.updatedAt > note.createdAt && (
            <> • Updated: {format(new Date(note.updatedAt), 'MMM dd, yyyy HH:mm')}</>
          )}
        </span>
      </div>
    </div>
  );
}