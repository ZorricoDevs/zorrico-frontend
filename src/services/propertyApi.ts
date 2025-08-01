import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '../api';
const API_URL = `${API_BASE_URL}/property`;

export const getAllProperties = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getPropertyById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createProperty = async (data: any) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateProperty = async (id: string, data: any) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const softDeleteProperty = async (id: string) => {
  const res = await axios.patch(`${API_URL}/${id}/soft-delete`);
  return res.data;
};

export const restoreProperty = async (id: string) => {
  const res = await axios.patch(`${API_URL}/${id}/restore`);
  return res.data;
};
