// utils/services/ocrService.js
import axios from 'axios';

const API_URL = 'https://hammad712-urdu-ocr-app.hf.space/upload';

export const extractTextFromFile = async (fileUri, fileType) => {
  try {
    // Create form data for the file
    const formData = new FormData();
    
    // Determine file name and type
    const fileName = fileUri.split('/').pop();
    const mimeType = fileType === 'pdf' ? 'application/pdf' : 'image/jpeg';
    
    // Append the file to form data
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    });

    // Make the API request
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds timeout
    });

    // Return the extracted text
    return response.data.extracted_text;
    
  } catch (error) {
    console.error('OCR API Error:', error);
    
    // Enhanced error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from OCR service. Please check your internet connection.');
    } else {
      // Something happened in setting up the request
      throw new Error(`OCR request failed: ${error.message}`);
    }
  }
};