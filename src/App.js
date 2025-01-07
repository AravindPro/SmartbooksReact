import { useEffect, useState } from 'react';
// import './App.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Epubreader from './Epubreader';
import Upload from './Upload';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from "react-router-dom";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Epubreader />} />
            <Route path="/upload" element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
