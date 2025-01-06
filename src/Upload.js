import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FileUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
	// let URL = "http://127.0.0.1:8000";
    let URL = "https://smartbooks-sfgp.onrender.com";


	const navigate = useNavigate();  // Declare useNavigate at the top level
    // Function to handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Function to handle file upload (customize this logic)
    const handleUpload = () => {
        if (!selectedFile) {
            alert('Please select a file first!');
            return;
        }
		const formData = new FormData();
        formData.append('file', selectedFile);
		axios.post(`${URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }})
		.then((res)=>{
			if('filename' in res.data){
				console.log('File Uploaded:', selectedFile);
				console.log(res.data['filename']);
				return axios.post(`${URL}/addbook`, null, {params: { bookname:  res.data['filename']}});
			}
			else console.log(`Error: ${res.data}`);
		})
		.then((res)=>{
			console.log("Uploaded successfully!");
			navigate('/');
		})
		.catch((error)=>console.log(error));
        // Example: Logging file information to the console
        
        // Custom logic goes here (e.g., send to a server)
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', maxWidth: '400px' }}>
            <h2>Upload a File</h2>
            
            {/* File Input */}
            <input 
                type="file" 
                onChange={handleFileChange} 
                style={{ marginBottom: '10px' }}
            />
            
            {/* Upload Button */}
            <button 
                onClick={handleUpload} 
                style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
                Upload
            </button>

            {/* Display Selected File Info */}
            {selectedFile && (
                <p><strong>Selected File:</strong> {selectedFile.name}</p>
            )}
        </div>
    );
};

export default FileUploader;
