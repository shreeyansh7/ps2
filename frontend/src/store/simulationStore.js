import { create } from 'zustand';

const DEFAULT_INPUTS = {
  income_tax:25, corp_tax:21, edu_spend:4.5, health_spend:5.0,
  infra_spend:3.0, subsidy:2.0, min_wage_delta:0, rd_spend:1.5,
};

const DEFAULT_OUTPUTS = {
  gdp_growth:   [3.1,3.4,3.8,4.1,4.6],
  unemployment: [5.8,5.5,5.2,4.9,4.7],
  inflation:    [3.2,3.0,2.9,2.8,2.7],
  debt_pct_gdp: [65.0,66.2,67.1,67.8,68.0],
  poverty_index:[22.1,21.0,19.8,18.5,17.2],
  gini_coeff:   0.31,
};

const useSimulationStore = create((set) => ({
  inputs:        { ...DEFAULT_INPUTS },
  outputs:       { ...DEFAULT_OUTPUTS },
  riskLevel:     'moderate',
  riskReasons:   [],
  sensitivity:   {},
  warnings:      [],
  isLoading:     false,
  activeCountry: null,
  playbackYear:  4,

  setInputs:     (inputs)  => set({ inputs }),
  updateInput:   (key,val) => set(s => ({ inputs: { ...s.inputs, [key]: val } })),
  setLoading:    (v)       => set({ isLoading: !!v }),
  setActiveCountry: (code) => set({ activeCountry: code }),
  setPlaybackYear:  (yr)   => set({ playbackYear: yr }),

  setOutputs: (outputs, riskLevel, riskReasons, sensitivity, warnings) => set({
    outputs:     outputs     || { ...DEFAULT_OUTPUTS },
    riskLevel:   riskLevel   || 'stable',
    riskReasons: riskReasons || [],
    sensitivity: sensitivity || {},
    warnings:    warnings    || [],
  }),

  loadPreset: (presetData) => set({
    inputs:        { ...DEFAULT_INPUTS, ...(presetData.policy_profile || {}) },
    activeCountry: presetData.code || null,
  }),

  resetInputs: () => set({ inputs: { ...DEFAULT_INPUTS }, activeCountry: null }),
}));

export default useSimulationStore;
