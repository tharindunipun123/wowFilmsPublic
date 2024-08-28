import React, { useState } from 'react';
import { FaFileUpload, FaFileVideo, FaFileImage, FaFileAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './UploadFilms.css';

const UploadFilms = () => {
  const Navigator = useNavigate();

  const [filmName, setFilmName] = useState('');
  const [description, setDescription] = useState('');
  const [qualitySelect, setQualitySelect] = useState('720');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [subtitle, setSubtitle] = useState(null);

  const success = () => {
    Navigator("/home");
 };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('filmName', filmName);
    formData.append('description', description);
    formData.append('qualitySelect', qualitySelect);
    formData.append('thumbnailUpload', thumbnail);
    formData.append('videoUpload', video);
    formData.append('subtitleUpload', subtitle);

    try {
      const response = await fetch('http://109.199.99.84:3000/upload-film', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        swal({
          title: 'Congrats!',
          text: 'Film Uploaded Successfully',
          icon: 'success',
          button: 'Done',
        }).then(() => {
          Navigator("/home");
        });
        //alert(data.message);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error uploading film:', error);
      alert('Error uploading film');
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2 className="text-center mb-4">Upload New Film</h2>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="filmName">Film Name</label>
            <input
              type="text"
              id="filmName"
              className="form-control"
              placeholder="Enter film name"
              value={filmName}
              onChange={(e) => setFilmName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-control"
              placeholder="Enter film description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="thumbnailUpload">
              <FaFileImage className="icon" /> Upload Thumbnail
            </label>
            <input
              type="file"
              id="thumbnailUpload"
              className="form-control"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="videoUpload">
              <FaFileVideo className="icon" /> Upload Film Video (MP4)
            </label>
            <input
              type="file"
              id="videoUpload"
              className="form-control"
              accept="video/mp4"
              onChange={(e) => setVideo(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="qualitySelect">Select Quality</label>
            <select
              id="qualitySelect"
              className="form-control"
              value={qualitySelect}
              onChange={(e) => setQualitySelect(e.target.value)}
              required
            >
              <option value="720">720p</option>
              <option value="1080">1080p</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="subtitleUpload">
              <FaFileAlt className="icon" /> Upload Subtitle File
            </label>
            <input
              type="file"
              id="subtitleUpload"
              className="form-control"
              accept=".srt,.vtt"
              onChange={(e) => setSubtitle(e.target.files[0])}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            <FaFileUpload className="icon" /> Upload Film
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadFilms;
