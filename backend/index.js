const express = require('express');
const mysql = require('mysql2');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const port = 3000;


app.use(express.json());

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve files publicly

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'wowfilms' 
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the MySQL database.');
  }
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM usertable WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
    
      res.json({ message: 'Login successful', userId: results[0].userId });
    } else {
      
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});


// configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadFolder = {
      thumbnailUpload: 'uploads/thumbnails/',
      videoUpload: 'uploads/videos/',
      subtitleUpload: 'uploads/subtitles/',
    }[file.fieldname];

   
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});


const upload = multer({ storage });


app.post('/upload-film', upload.fields([
  { name: 'thumbnailUpload', maxCount: 1 },
  { name: 'videoUpload', maxCount: 1 },
  { name: 'subtitleUpload', maxCount: 1 },
]), (req, res) => {
  const { filmName, description, qualitySelect } = req.body;
  const thumbnailUrl = req.files['thumbnailUpload'][0].path;
  const filmUrl = req.files['videoUpload'][0].path;
  const subtitleUrl = req.files['subtitleUpload'][0].path;

  
  const insertFilmQuery = `
    INSERT INTO filmtable (name, description, thumbnailUrl, filmUrl, quality)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(insertFilmQuery, [filmName, description, thumbnailUrl, filmUrl, qualitySelect], (err, result) => {
    if (err) {
      console.error('Error inserting film data:', err);
      return res.status(500).json({ message: 'Error inserting film data' });
    }

    const filmId = result.insertId;

    const insertSubtitleQuery = `
      INSERT INTO subtittletable (name, fileUrl, filmId)
      VALUES (?, ?, ?)
    `;
    db.query(insertSubtitleQuery, [filmName, subtitleUrl, filmId], (err, result) => {
      if (err) {
        console.error('Error inserting subtitle data:', err);
        return res.status(500).json({ message: 'Error inserting subtitle data' });
      }

      res.json({ message: 'Film and subtitle uploaded successfully' });
    });
  });
});



const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file: ${filePath}`, err);
    });
  } else {
    console.warn(`File not found, skipping deletion: ${filePath}`);
  }
};


app.delete('/films/:id', (req, res) => {
  const filmId = req.params.id;


  const selectQuery = `
    SELECT filmtable.filmUrl, filmtable.thumbnailUrl, subtittletable.fileUrl
    FROM filmtable
    LEFT JOIN subtittletable ON filmtable.f_id = subtittletable.filmId
    WHERE filmtable.f_id = ?
  `;
  db.query(selectQuery, [filmId], (err, results) => {
    if (err) {
      console.error('Error fetching file paths:', err);
      return res.status(500).json({ message: 'Error fetching file paths' });
    }

    if (results.length > 0) {
      results.forEach((result) => {
        deleteFile(result.filmUrl);
        deleteFile(result.thumbnailUrl);
        deleteFile(result.fileUrl);
      });

     
      const deleteSubtitleQuery = `DELETE FROM subtittletable WHERE filmId = ?`;
      db.query(deleteSubtitleQuery, [filmId], (err) => {
        if (err) {
          console.error('Error deleting subtitle records:', err);
          return res.status(500).json({ message: 'Error deleting subtitle records' });
        }

        
        const deleteFilmQuery = `DELETE FROM filmtable WHERE f_id = ?`;
        db.query(deleteFilmQuery, [filmId], (err) => {
          if (err) {
            console.error('Error deleting film record:', err);
            return res.status(500).json({ message: 'Error deleting film record' });
          }

          res.json({ message: 'Film and subtitles deleted successfully' });
        });
      });
    } else {
      res.status(404).json({ message: 'Film not found' });
    }
  });
});

app.get('/films/:id', (req, res) => {
  const filmId = req.params.id;

  const selectQuery = 'SELECT * FROM filmtable WHERE f_id = ?';
  db.query(selectQuery, [filmId], (err, results) => {
    if (err) {
      console.error('Error fetching film:', err);
      return res.status(500).json({ message: 'Error fetching film' });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Film not found' });
    }
  });
});


app.get('/films', (req, res) => {
  const query = 'SELECT * FROM filmtable';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching films:', err);
      return res.status(500).json({ message: 'Error fetching films' });
    }

    res.json(results);
  });
});



////////////////////////////////////////////////////////////////////////sub titile page////////////////////////////////////////////////////////////////////////////////



app.get('/subtitles', (req, res) => {
  const query = `
    SELECT subtittletable.s_id as subtitleId, subtittletable.name as subtitleName, subtittletable.fileUrl as subtitleUrl,
           filmtable.f_id as filmId, filmtable.name as filmName, filmtable.thumbnailUrl
    FROM subtittletable
    JOIN filmtable ON subtittletable.filmId = filmtable.f_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching subtitles:', err);
      return res.status(500).json({ message: 'Error fetching subtitles' });
    }

    res.json(results);
  });
});


const subtitleUpload = multer({ storage: multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadFolder = 'uploads/subtitles/';
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})});



app.post('/subtitles', subtitleUpload.single('subtitleFile'), (req, res) => {
  const { selectedFilm } = req.body;
  const subtitleUrl = req.file.path;

  const getFilmIdQuery = 'SELECT f_id FROM filmtable WHERE name = ?';
  db.query(getFilmIdQuery, [selectedFilm], (err, filmResults) => {
    if (err) {
      console.error('Error fetching film ID:', err);
      return res.status(500).json({ message: 'Error fetching film ID' });
    }

    if (filmResults.length > 0) {
      const filmId = filmResults[0].f_id;

      const insertSubtitleQuery = `
        INSERT INTO subtittletable (name, fileUrl, filmId)
        VALUES (?, ?, ?)
      `;
      db.query(insertSubtitleQuery, [selectedFilm, subtitleUrl, filmId], (err, result) => {
        if (err) {
          console.error('Error inserting subtitle data:', err);
          return res.status(500).json({ message: 'Error inserting subtitle data' });
        }

        res.json({ message: 'Subtitle uploaded successfully' });
      });
    } else {
      res.status(404).json({ message: 'Film not found' });
    }
  });
});



app.delete('/subtitles/:id', (req, res) => {
  const subtitleId = req.params.id;

  const getSubtitleQuery = 'SELECT fileUrl FROM subtittletable WHERE s_id = ?';
  db.query(getSubtitleQuery, [subtitleId], (err, results) => {
    if (err) {
      console.error('Error fetching subtitle file path:', err);
      return res.status(500).json({ message: 'Error fetching subtitle file path' });
    }

    if (results.length > 0) {
      const filePath = results[0].fileUrl;

      
      deleteFile(filePath);

      const deleteSubtitleQuery = 'DELETE FROM subtittletable WHERE s_id = ?';
      db.query(deleteSubtitleQuery, [subtitleId], (err) => {
        if (err) {
          console.error('Error deleting subtitle record:', err);
          return res.status(500).json({ message: 'Error deleting subtitle record' });
        }

        res.json({ message: 'Subtitle deleted successfully' });
      });
    } else {
      res.status(404).json({ message: 'Subtitle not found' });
    }
  });
});



app.get('/download/:id', (req, res) => {
  const filmId = req.params.id;

  
  const selectQuery = 'SELECT filmUrl, name FROM filmtable WHERE f_id = ?';
  db.query(selectQuery, [filmId], (err, results) => {
    if (err) {
      console.error('Error fetching film:', err);
      return res.status(500).json({ message: 'Error fetching film' });
    }

    if (results.length > 0) {
      const filmPath = path.join(__dirname, results[0].filmUrl);
      const filmName = results[0].name;

      
      res.download(filmPath, `${filmName}.mp4`, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).send('Error downloading file.');
        }
      });
    } else {
      res.status(404).json({ message: 'Film not found' });
    }
  });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
