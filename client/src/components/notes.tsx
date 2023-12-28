import { Check, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Notes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // New state for closing animation
  const [noteText, setNoteText] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    if (savedNotes) {
      setSavedNotes(savedNotes);
    }
  }, []);

  const handleToggle = () => {
    if (isOpen) {
      // Start closing animation
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 400); // The duration of the scale-out-right animation
    } else {
      setIsOpen(true);
    }
    setSelectedNote(null);
    setNoteText('');
  };

  const handleInputChange = (e) => {
    setNoteText(e.target.value);
  };

  const handleSaveNote = () => {
    if (noteText) {
        if (selectedNote) {
          const updatedNotes = savedNotes.map((note) =>
            note.id === selectedNote.id ? { ...note, text: noteText } : note
          );
          setSavedNotes(updatedNotes);
          localStorage.setItem('notes', JSON.stringify(updatedNotes));
          setSelectedNote(null);
        } else {
          const newNote = {
            id: Date.now(),
            text: noteText,
          };
          const updatedNotes = [...savedNotes, newNote];
          setSavedNotes(updatedNotes);
          localStorage.setItem('notes', JSON.stringify(updatedNotes));
        }
        setNoteText('');
    }

    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 400);
    }
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = savedNotes.filter((note) => note.id !== id);
    setSavedNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
      setNoteText('');
    }

    if (isOpen && selectedNote && selectedNote.id === id) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 400);
    }
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setNoteText(note.text);
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-8 right-8 z-30">
        <button
            className={`bg-yellow-400 rounded-full w-12 h-12 p-2 flex items-center justify-center shadow-lg ${isOpen ? 'scale-up-br' : ''} ${isClosing ? 'scale-out-right' : ''}`}
            onClick={handleToggle}
        >
            {isOpen ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className='h-6 w-6 text-gray-800'
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            )}      
        </button>
        {isOpen && (
            <div className={`bg-purple-400 p-4 rounded-lg shadow-lg mt-4 w-60 scale-up-br ${isClosing ? 'scale-out-right' : ''}`}>
                <textarea
                    className="w-full h-32 resize-none bg-transparent text-white placeholder-white border-0 outline-none"
                    placeholder="Write your note..."
                    value={noteText}
                    onChange={handleInputChange}
                ></textarea>
                <div className="flex gap-x-2">
                    <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                    onClick={handleSaveNote}
                    >
                    <Check className='w-4' />
                    </button>
                    {selectedNote && (
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                        onClick={() => handleDeleteNote(selectedNote.id)}
                    >
                        <Trash className='w-4' />
                    </button>
                    )}
                </div>
            </div>
        )}
        {isOpen && (
            <div className={`flex mt-4 gap-x-2 scale-up-br ${isClosing ? 'scale-out-right' : ''}`}>
            {savedNotes.map((note) => (
                <div
                key={note.id}
                className={`bg-purple-400 p-4 rounded-full shadow-lg mb-4 ${
                    selectedNote && selectedNote.id === note.id ? 'border-2 border-blue-500' : ''
                }`}
                onClick={() => handleEditNote(note)}
                >
                {/* button moved here */}
                </div>
            ))}
            </div>
        )}
    </div>
  );
};

export default Notes;
