import { create } from 'zustand';
import * as svc from '../services/scenarios';

const useScenarioStore = create((set) => ({
  scenarios: [],
  isLoading: false,
  compareA:  null,
  compareB:  null,

  fetchScenarios: async () => {
    set({ isLoading: true });
    try {
      const { scenarios } = await svc.getScenarios();
      set({ scenarios: scenarios || [] });
    } catch(e) { console.error(e); }
    finally { set({ isLoading: false }); }
  },

  saveScenario: async (payload) => {
    const { scenario } = await svc.saveScenario(payload);
    set(s => ({ scenarios: [scenario, ...s.scenarios] }));
    return scenario;
  },

  deleteScenario: async (id) => {
    await svc.deleteScenario(id);
    set(s => ({ scenarios: s.scenarios.filter(x => x._id !== id) }));
  },

  setCompareA: (s) => set({ compareA: s }),
  setCompareB: (s) => set({ compareB: s }),
}));

export default useScenarioStore;
