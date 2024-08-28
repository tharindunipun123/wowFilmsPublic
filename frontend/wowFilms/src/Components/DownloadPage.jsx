import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaFilm } from 'react-icons/fa';
import './DownloadPage.css';
import { FaDownload } from 'react-icons/fa';
import logo from './Logo-2-e1723833190195.png';

const DownloadPage = () => {
  const { id } = useParams(); // Get the film ID from the URL
  const [film, setFilm] = useState(null);
  const [error, setError] = useState(null);
  //localhost

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(`http://localhost:3000/films/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch film data');
        }
        const data = await response.json();
        setFilm(data);
      } catch (error) {
        console.error('Error fetching film:', error);
        setError(error.message);
      }
    };

    fetchFilm();
  }, [id]);

  const handleDownload = () => {
    if (film && film.filmUrl) {
      window.location.href = `http://localhost:3000/download/${id}`; // Updated to use the new download endpoint
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!film) {
    return <div>Loading...</div>;
  }

  return (
    <div className="download-page-wrapper">
      
      
      <div className="download-page-container">
      <img src={logo} alt="Logo" className="logo" /> {/* New Logo Image */}
        
        <img src={`http://localhost:3000/${film.thumbnailUrl}`} alt={film.name} className="thumbnail" />
        <h1>{film.name}</h1>
        <p>{film.description}</p>
        <button onClick={handleDownload} className="btn btn-primary"><FaDownload className="download-icon" />Download Now</button>
      </div>
      
    </div>
  );
};

export default DownloadPage;
