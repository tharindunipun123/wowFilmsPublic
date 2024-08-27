import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter ,Route , Routes } from 'react-router-dom';
import './App.css'
import Login from './Components/loginCmp';
import HomePage from './Components/HomePage';
import UploadFilms from './Components/UploadFilms';
import ViewFilms from './Components/ViewFilms';
import ViewSubtitles from './Components/ViewSubtitles';
import DownloadPage from './Components/DownloadPage';

function App() {

  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Login/>}> </Route>
    <Route path="/home" element={<HomePage/>}> </Route>
    <Route path="/upload" element={<UploadFilms />} />
    <Route path="/view" element={<ViewFilms />} />
    <Route path="/subtitles" element={<ViewSubtitles />} />
    <Route path="/download/:id" element={<DownloadPage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
