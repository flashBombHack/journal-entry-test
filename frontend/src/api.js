// src/api/index.ts
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const fetchEntries = async () => {
  const response = await axios.get(`${API_URL}/entries`);
  return response.data;
};

export const createEntry = async (form) => {
  try {
    const response = await axios.post(`${API_URL}/entries`, form);
    return response.data;
  } catch (error) {
    // Capture specific backend message
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create journal entry');
  }
};

export const fetchLedger = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}/ledger`, {
    params: { page, limit },
  });
  return response.data;
};
