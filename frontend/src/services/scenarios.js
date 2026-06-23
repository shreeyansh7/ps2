import api from './api';
export const getScenarios    = async ()      => (await api.get('/scenarios')).data;
export const saveScenario    = async (p)     => (await api.post('/scenarios', p)).data;
export const deleteScenario  = async (id)    => (await api.delete(`/scenarios/${id}`)).data;
