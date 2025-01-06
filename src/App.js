import { useEffect, useState } from 'react';
// import './App.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Epubreader from './Epubreader';
import Upload from './Upload';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/epub" element={<Epubreader />} />
            <Route path="/" element={<Upload />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
