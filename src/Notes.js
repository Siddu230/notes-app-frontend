import React from 'react';

const Notes = ({ notes, onEdit, onDelete }) => {
  return (
    <div>
      <h2>Notes List</h2>
      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul>
          {notes.map(note => (
            <li key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => onEdit(note)}>Edit</button>
              <button onClick={() => onDelete(note.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notes;