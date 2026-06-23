import { useCallback, useRef, useEffect } from 'react';
import useSimulationStore from '../store/simulationStore';
import { runSimulation } from '../services/simulation';
import { getCountryPreset } from '../services/countries';

export function useSimulation() {
  const timerRef = useRef(null);

  const simulate = useCallback(async (inputs, countryCode) => {
    useSimulationStore.getState().setLoading(true);
    try {
      const result = await runSimulation(inputs, countryCode);
      if (result.success) {
        useSimulationStore.getState().setOutputs(
          result.outputs, result.risk_level,
          result.risk_reasons, result.sensitivity, result.warnings
        );
      }
    } catch(e) { console.error('Simulation error:', e); }
    finally { useSimulationStore.getState().setLoading(false); }
  }, []);

  const debouncedSimulate = useCallback((inputs, countryCode) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => simulate(inputs, countryCode), 350);
  }, [simulate]);

  const loadPreset = useCallback(async (code) => {
    useSimulationStore.getState().setLoading(true);
    try {
      const { country } = await getCountryPreset(code);
      useSimulationStore.getState().loadPreset(country);
      const updatedInputs = useSimulationStore.getState().inputs;
      await simulate(updatedInputs, code);
    } catch(e) {
      console.error('Preset error:', e);
      useSimulationStore.getState().setLoading(false);
    }
  }, [simulate]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { simulate, debouncedSimulate, loadPreset };
}
