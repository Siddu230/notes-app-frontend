import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notes from './Notes';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('https://notes-app-backend-dmnm.onrender.com');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote({ ...newNote, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;
    try {
      await axios.post('https://notes-app-backend-dmnm.onrender.com', newNote);
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingNote({ ...editingNote, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://notes-app-backend-dmnm.onrender.com/${editingNote.id}`, editingNote);
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://notes-app-backend-dmnm.onrender.com/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="App">
      <h1>Notes App</h1>
      <div>
        <h2>Add Note</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={newNote.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
          />
          <textarea
            name="content"
            value={newNote.content}
            onChange={handleInputChange}
            placeholder="Content"
            required
          />
          <button type="submit">Add Note</button>
        </form>
      </div>
      {editingNote && (
        <div>
          <h2>Edit Note</h2>
          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              name="title"
              value={editingNote.title}
              onChange={handleEditChange}
              placeholder="Title"
              required
            />
            <textarea
              name="content"
              value={editingNote.content}
              onChange={handleEditChange}
              placeholder="Content"
              required
            />
            <button type="submit">Update Note</button>
            <button type="button" onClick={() => setEditingNote(null)}>Cancel</button>
          </form>
        </div>
      )}
      <Notes notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}

export default App;