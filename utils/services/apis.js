// utils/services/apis.js
import axios from 'axios';

const BASE_URL = 'https://hammad712-urdu-ocr-app.hf.space';
const BASE_URL2 = 'https://hammad712-recitation-compare.hf.space';


const API_ENDPOINTS = {
  OCR: '/upload',
  COMPARE_DTW: '/compare-dtw'
};

export const extractTextFromFile = async (fileUri, fileType) => {
  try {
    const formData = new FormData();
    const fileName = fileUri.split('/').pop();
    const mimeType = fileType === 'pdf' ? 'application/pdf' : 'image/jpeg';
    
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    });

    const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.OCR}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    return response.data.extracted_text;
    
  } catch (error) {
    console.error('OCR API Error:', error);
    if (error.response) {
      throw new Error(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      throw new Error('No response from OCR service. Please check your internet connection.');
    } else {
      throw new Error(`OCR request failed: ${error.message}`);
    }
  }
};

// Update the compareDTW function to match the API expectations
export const compareDTW = async (originalAudio, userAudio) => {
  try {
    const formData = new FormData();
    
    // Add file extension check and conversion if needed
    const originalExt = originalAudio.name.split('.').pop().toLowerCase();
    const userExt = userAudio.name.split('.').pop().toLowerCase();
    
    console.log(`File extensions: original=${originalExt}, user=${userExt}`);
    
    formData.append('audio1', {
      uri: originalAudio.uri,
      name: originalAudio.name,
      type: originalExt === 'mp3' ? 'audio/mp3' : 'audio/ogg',
    });

    formData.append('audio2', {
      uri: userAudio.uri,
      name: userAudio.name,
      type: userExt === 'mp3' ? 'audio/mp3' : 'audio/ogg',
    });

    console.log('Making API request to:', `${BASE_URL2}${API_ENDPOINTS.COMPARE_DTW}`);
    
    const response = await axios.post(`${BASE_URL2}${API_ENDPOINTS.COMPARE_DTW}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      timeout: 160000, 
    });
    
    
      return response.data;
    
    
  } catch (error) {
    console.error('DTW Comparison API Error:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('Error response data:', error.response.data);
      throw new Error(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('Error request details:', error.request);
    } 
  }
};