// import React, { useState, useEffect } from 'react';
// import { FaSearch, FaCopy, FaTrashAlt } from 'react-icons/fa';
// import './ViewFilms.css';

// const ViewFilms = () => {
//   const [filmsData, setFilmsData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [qualityFilter, setQualityFilter] = useState('all');

//   // Fetch films from the backend
//   useEffect(() => {
//     const fetchFilms = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/films');
//         const data = await response.json();
//         setFilmsData(data);
//       } catch (error) {
//         console.error('Error fetching films:', error);
//       }
//     };

//     fetchFilms();
//   }, []);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleQualityFilter = (quality) => {
//     setQualityFilter(quality);
//   };

//   const filteredFilms = filmsData.filter((film) => {
//     const matchesSearch = film.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesQuality = qualityFilter === 'all' || film.quality === qualityFilter;
//     return matchesSearch && matchesQuality;
//   });

//   const copyToClipboard = (filmId) => {
//     const downloadUrl = `http://yourdomain.com/download.php?id=${filmId}`;
//     navigator.clipboard.writeText(downloadUrl);
//     alert('Film URL copied to clipboard!');
//   };

//   const copyUrlWithoutId = (filmUrl) => {
//     const videoPlayerUrl = `http://yourdomain.com/${filmUrl}`;
//     navigator.clipboard.writeText(videoPlayerUrl);
//     alert('Video Player URL copied to clipboard!');
//   };

//   const deleteFilm = async (id) => {
//     const confirmDelete = window.confirm(`Are you sure you want to delete the film with ID ${id}?`);
//     if (!confirmDelete) return;

//     try {
//       const response = await fetch(`http://localhost:3000/films/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         alert('Film deleted successfully.');
//         setFilmsData(filmsData.filter(film => film.f_id !== id));
//       } else {
//         const data = await response.json();
//         alert('Error: ' + data.message);
//       }
//     } catch (error) {
//       console.error('Error deleting film:', error);
//       alert('Error deleting film');
//     }
//   };

//   return (
//     <div className="view-films-container">
//       <div className="filter-container">
//         <div className="search-bar">
//           <FaSearch className="icon" />
//           <input
//             type="text"
//             placeholder="Search films..."
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//         </div>
//         <div className="quality-filter">
//           <button
//             className={`filter-button ${qualityFilter === '720' ? 'active' : ''}`}
//             onClick={() => handleQualityFilter('720')}
//           >
//             720p
//           </button>
//           <button
//             className={`filter-button ${qualityFilter === '1080' ? 'active' : ''}`}
//             onClick={() => handleQualityFilter('1080')}
//           >
//             1080p
//           </button>
//           <button
//             className={`filter-button ${qualityFilter === 'all' ? 'active' : ''}`}
//             onClick={() => handleQualityFilter('all')}
//           >
//             All
//           </button>
//         </div>
//       </div>

//       <table className="films-table">
//         <thead>
//           <tr>
//             <th>Thumbnail</th>
//             <th>Film Name</th>
//             <th>Description</th>
//             <th>Quality</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredFilms.map((film) => (
//             <tr key={film.f_id}>
//               <td><img src={`http://localhost:3000/${film.thumbnailUrl}`} alt={film.name} className="thumbnail" /></td>
//               <td>{film.name}</td>
//               <td>{film.description}</td>
//               <td>{film.quality}</td>
//               <td>
//                 <button
//                   className="action-button copy"
//                   onClick={() => copyToClipboard(film.f_id)}
//                 >
//                   <FaCopy /> Copy Download URL
//                 </button>
//                 <button
//                   className="action-button copy"
//                   onClick={() => copyUrlWithoutId(film.filmUrl)}
//                 >
//                   <FaCopy /> Copy Video URL
//                 </button>
//                 <button
//                   className="action-button delete"
//                   onClick={() => deleteFilm(film.f_id)}
//                 >
//                   <FaTrashAlt /> Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ViewFilms;

import React, { useState, useEffect } from 'react';
import { FaSearch, FaCopy, FaTrashAlt } from 'react-icons/fa';
import './ViewFilms.css';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const ViewFilms = () => {
  const [filmsData, setFilmsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [qualityFilter, setQualityFilter] = useState('all');
  const navigate = useNavigate(); // For programmatic navigation

  // Fetch films from the backend
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch('http://localhost:3000/films');
        const data = await response.json();
        setFilmsData(data);
      } catch (error) {
        console.error('Error fetching films:', error);
      }
    };

    fetchFilms();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleQualityFilter = (quality) => {
    setQualityFilter(quality);
  };

  const filteredFilms = filmsData.filter((film) => {
    const matchesSearch = film.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuality = qualityFilter === 'all' || film.quality === qualityFilter;
    return matchesSearch && matchesQuality;
  });

  const copyToClipboard = (filmId) => {
    const downloadUrl = `http://localhost:5173/download/${filmId}`; // Updated to reflect the new route
    navigator.clipboard.writeText(downloadUrl);
    swal({
      title: 'Copied!',
      text: 'Film Download URL copied to clipboard!',
      icon: 'success',
      button: 'Done',
    }).then(() => {
      
    });
    // alert('Film Download URL copied to clipboard!');
  };

  const copyUrlWithoutId = (filmUrl) => {
    const videoPlayerUrl = `http://109.199.99.84:3000/${filmUrl}`;
    navigator.clipboard.writeText(videoPlayerUrl);
    swal({
      title: 'Copied!',
      text: 'Film Vieo URL copied to clipboard!',
      icon: 'success',
      button: 'Done',
    }).then(() => {
      
    });
    // alert('Video Player URL copied to clipboard!');
  };

  const deleteFilm = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this film!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await fetch(`http://109.199.99.84:3000/films/${id}`, {
            method: 'DELETE',
          });
  
          if (response.ok) {
            swal("Success!", "The film has been deleted!", "success");
            setFilmsData(filmsData.filter(film => film.f_id !== id));
          } else {
            const data = await response.json();
            swal("Error", data.message, "error");
          }
        } catch (error) {
          console.error('Error deleting film:', error);
          swal("Error", "There was a problem deleting the film.", "error");
        }
      } else {
        swal("Cancelled", "Your film is safe!", "info");
      }
    });
  };

  return (
    <div className="view-films-container">
      <div className="filter-container">
        <div className="search-bar">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Search films..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="quality-filter">
          <button
            className={`filter-button ${qualityFilter === '720' ? 'active' : ''}`}
            onClick={() => handleQualityFilter('720')}
          >
            720p
          </button>
          <button
            className={`filter-button ${qualityFilter === '1080' ? 'active' : ''}`}
            onClick={() => handleQualityFilter('1080')}
          >
            1080p
          </button>
          <button
            className={`filter-button ${qualityFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleQualityFilter('all')}
          >
            All
          </button>
        </div>
      </div>

      <table className="films-table">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Film Name</th>
            <th>Description</th>
            <th>Quality</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFilms.map((film) => (
            <tr key={film.f_id}>
              <td><img src={`http://109.199.99.84:3000/${film.thumbnailUrl}`} alt={film.name} className="thumbnail" /></td>
              <td>{film.name}</td>
              <td>{film.description}</td>
              <td>{film.quality}</td>
              <td>
                <button
                  className="action-button copy"
                  onClick={() => copyToClipboard(film.f_id)}
                >
                  <FaCopy /> Copy Download URL
                </button>
                <button
                  className="action-button copy"
                  onClick={() => copyUrlWithoutId(film.filmUrl)}
                >
                  <FaCopy /> Copy Video URL
                </button>
                <button
                  className="action-button delete"
                  onClick={() => deleteFilm(film.f_id)}
                >
                  <FaTrashAlt /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewFilms;

