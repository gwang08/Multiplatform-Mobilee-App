import axios from 'axios';

const API_URL = 'https://6823f27165ba05803398599c.mockapi.io/se184185/se184185';

export const fetchPlayers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const fetchPlayerById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching player with id ${id}:`, error);
    throw error;
  }
};

export const createPlayer = async (playerData) => {
  try {
    const response = await axios.post(API_URL, playerData);
    return response.data;
  } catch (error) {
    console.error('Error creating player:', error);
    throw error;
  }
};

export const updatePlayer = async (id, playerData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, playerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating player with id ${id}:`, error);
    throw error;
  }
};

export const deletePlayer = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting player with id ${id}:`, error);
    throw error;
  }
};