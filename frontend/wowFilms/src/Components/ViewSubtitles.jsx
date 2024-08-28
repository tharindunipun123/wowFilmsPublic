import React, { useState, useEffect } from 'react';
import { FaCopy, FaTrashAlt, FaPlus, FaSearch } from 'react-icons/fa';
import './ViewSubtitles.css';

const ViewSubtitles = () => {
  const [showForm, setShowForm] = useState(false);
  const [films, setFilms] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState('');
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://109.199.99.84:3000/subtitles')
      .then(response => response.json())
      .then(data => setFilms(data))
      .catch(error => console.error('Error fetching subtitles:', error));
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleFileUpload = (e) => {
    setSubtitleFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('selectedFilm', selectedFilm);
    formData.append('subtitleFile', subtitleFile);

    fetch('http://109.199.99.84:3000/subtitles', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        setShowForm(false);
        // Reload subtitles after successful upload
        fetch('http://109.199.99.84:3000/subtitles')
          .then(response => response.json())
          .then(data => setFilms(data));
      })
      .catch(error => console.error('Error uploading subtitle:', error));
  };

  const filteredFilms = films.filter((film) =>
    film.filmName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    swal({
      title: 'Copied!',
      text: 'Subtitle Download URL copied to clipboard!',
      icon: 'success',
      button: 'Done',
    }).then(() => {
      
    });
    //alert('Subtitle URL copied to clipboard!');
  };

  const deleteSubtitle = (id) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this subtitle?`);
    if (!confirmDelete) return;

    fetch(`http://109.199.99.84:3000/subtitles/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        setFilms(films.filter(film => film.subtitleId !== id));
      })
      .catch(error => console.error('Error deleting subtitle:', error));
  };

  return (
    <div className="view-subtitles-container">
      <div className="filter-container">
        <div className="search-bar">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Search films..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-subtitle-button" onClick={toggleForm}>
          <FaPlus /> Add Subtitle
        </button>
      </div>

      <table className="subtitles-table">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Film Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFilms.map((film) => (
            <tr key={film.subtitleId}>
              <td><img src={`http://109.199.99.84:3000/${film.thumbnailUrl}`} alt={film.filmName} className="thumbnail" /></td>
              <td>{film.filmName}</td>
              <td>
                <button
                  className="action-button copy"
                  onClick={() => copyToClipboard(`http://109.199.99.84:3000/${film.subtitleUrl}`)}
                >
                  <FaCopy /> Copy URL
                </button>
                <button
                  className="action-button delete"
                  onClick={() => deleteSubtitle(film.subtitleId)}
                >
                  <FaTrashAlt /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>Add Subtitle</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="filmSelect">Select Film</label>
                <select
                  id="filmSelect"
                  className="form-control"
                  value={selectedFilm}
                  onChange={(e) => setSelectedFilm(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a film</option>
                  {films.map((film) => (
                    <option key={film.filmId} value={film.filmName}>{film.filmName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="subtitleFile">Upload Subtitle File</label>
                <input
                  type="file"
                  id="subtitleFile"
                  className="form-control"
                  accept=".srt,.vtt"
                  onChange={handleFileUpload}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Upload</button>
              <button type="button" className="btn btn-secondary" onClick={toggleForm}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSubtitles;
