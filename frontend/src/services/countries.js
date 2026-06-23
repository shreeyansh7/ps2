import api from './api';
export const getCountries    = async ()     => (await api.get('/countries')).data;
export const getCountryPreset= async (code) => (await api.get(`/countries/${code}`)).data;
