import axios from 'axios';

const API_URL = 'http://localhost:9002/api';

export const depositService = {
  getAllDeposits: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/deposits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deposits:', error);
      throw error;
    }
  },
};