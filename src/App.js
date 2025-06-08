import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notes from './Notes';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://notes-app-backend-dmnm.onrender.com/notes');
      setNotes(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching notes:', error.message, error.response?.status, error.response?.data);
      setError('Failed to fetch notes. Please try again.');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote({ ...newNote, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;
    setLoading(true);
    try {
      await axios.post('https://notes-app-backend-dmnm.onrender.com/notes', newNote);
      setNewNote({ title: '', content: '' });
      fetchNotes();
      setError(null);
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note. Please try again.');
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      await axios.put(`https://notes-app-backend-dmnm.onrender.com/notes/${editingNote.id}`, editingNote);
      setEditingNote(null);
      fetchNotes();
      setError(null);
    } catch (error) {
      console.error('Error updating note:', error);
      setError('Failed to update note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`https://notes-app-backend-dmnm.onrender.com/notes/${id}`);
      fetchNotes();
      setError(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Notes App</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
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