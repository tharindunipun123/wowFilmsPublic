import React from 'react';
import { FaUpload, FaFilm, FaCog, FaSignOutAlt } from 'react-icons/fa'; // Importing icons from react-icons
import './HomePage.css'; // Import custom CSS for styling
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const Navigator = useNavigate();

  const handleLogout = () => {
     Navigator("/");
  };

  const UploadFilms = () =>{
   Navigator("/upload");
  }

  const ViewFilms = () =>{
    Navigator("/view");
   }

   const ViewSubtitles = () =>{
    Navigator("/subtitles");
   }

  return (

    <div className="home-container">
      <div className="button-container">
        <div className="home-button" onClick={UploadFilms}>
          <FaUpload size={50} />
          <p>Upload Films</p>
        </div>
        <div className="home-button" onClick={ViewFilms}>
          <FaFilm size={50} />
          <p>View Films</p>
        </div>
        <div className="home-button" onClick={ViewSubtitles}>
          <FaCog size={50} />
          <p>View Subtitles</p>
        </div>
        
        <div className="home-button" onClick={handleLogout}>
          <FaSignOutAlt size={50} />
          <p >Logout</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
