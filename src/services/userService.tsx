import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createUser = async (userId: string, userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(
    `${API_URL}/api/v1/users`, 
    userData,
    {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    }
  );
  return response.data;
};