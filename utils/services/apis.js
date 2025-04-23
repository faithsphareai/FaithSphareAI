// utils/services/apis.js
import axios from 'axios';

const BASE_URL = 'https://hammad712-urdu-ocr-app.hf.space';
const BASE_URL2 = 'https://hammad712-recitation-compare.hf.space';
const AYAT_FINDER_URL = 'https://hammad712-ayat-finder.hf.space/query';


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

/**
 * Sends a question to the Ayat Finder API and returns the answer.
 * @param {string} question
 * @returns {Promise<string>} The answer from the API.
 */
export const getAyatAnswer = async (question) => {
  try {
    const response = await axios.post(
      AYAT_FINDER_URL,
      { question },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );
    // The API returns { answer: "..." }
    return response.data.answer;
  } catch (error) {
    console.error('Ayat Finder API Error:', error);
    if (error.response) {
      throw new Error(
        `Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`
      );
    } else if (error.request) {
      throw new Error('No response from Ayat Finder service. Please check your internet connection.');
    } else {
      throw new Error(`Ayat Finder request failed: ${error.message}`);
    }
  }
};

const QUIZ_API_URL = 'https://hammad712-islamic-quiz.hf.space/generate_quiz/';
const GRADE_QUIZ_API_URL = 'https://hammad712-islamic-quiz.hf.space/grade_quiz/';

/**
 * Generates a quiz question from the API
 * @param {string} search_query - The topic or context for the quiz
 * @returns {Promise<string>} The quiz question
 */
export const generateQuiz = async (search_query) => {
  try {
    const response = await axios.post(
      QUIZ_API_URL,
      { search_query },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );
    return response.data.quiz;
  } catch (error) {
    console.error('Quiz Generation API Error:', error);
    throw handleApiError(error, 'Quiz Generation');
  }
};

/**
 * Grades the user's answer to a quiz question
 * @param {string} answers - The user's answer
 * @returns {Promise<string>} The grading result
 */
export const gradeQuiz = async (answers) => {
  try {
    const response = await axios.post(
      GRADE_QUIZ_API_URL,
      { answers },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );
    return response.data.grade;
  } catch (error) {
    console.error('Quiz Grading API Error:', error);
    throw handleApiError(error, 'Quiz Grading');
  }
};

// Helper function for error handling
const handleApiError = (error, service) => {
  if (error.response) {
    return new Error(
      `${service} server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`
    );
  } else if (error.request) {
    return new Error(`No response from ${service} service. Please check your internet connection.`);
  } else {
    return new Error(`${service} request failed: ${error.message}`);
  }
};

// Add new constant for Hadith Finder API
const HADITH_FINDER_URL = 'https://hammad712-hadith-finder.hf.space/query';

/**
 * Sends a question to the Hadith Finder API and returns the answer
 * @param {string} question - The hadith query
 * @returns {Promise<string>} The answer from the API
 */
export const getHadithAnswer = async (question) => {
  try {
    const response = await axios.post(
      HADITH_FINDER_URL,
      { question },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );
    
    if (!response.data || !response.data.answer) {
      throw new Error('Invalid response format from Hadith Finder API');
    }
    
    return response.data.answer;
  } catch (error) {
    console.error('Hadith Finder API Error:', error);
    throw handleApiError(error, 'Hadith Finder');
  }
};