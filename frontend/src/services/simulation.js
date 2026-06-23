import api from './api';
export const runSimulation = async (inputs, countryCode) => {
  const { data } = await api.post('/simulate', { inputs, country_code: countryCode || null });
  return data;
};
