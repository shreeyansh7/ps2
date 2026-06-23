from simulation.formulas import calc_gdp, calc_unemployment, calc_inflation, calc_poverty, calc_gini

LAG = {
    'edu':    [0.20, 0.45, 0.70, 0.90, 1.00],
    'infra':  [1.00, 1.10, 1.15, 1.10, 1.05],
    'rd':     [0.10, 0.25, 0.55, 0.80, 1.00],
    'health': [0.40, 0.60, 0.80, 0.95, 1.00],
    'sub':    [1.00, 0.90, 0.80, 0.75, 0.70],
}

def _risk(gdp, unemp, inf, debt):
    reasons = []
    if debt > 90 or inf > 10 or unemp > 15:
        level = 'crisis'
    elif debt > 60 or inf > 4 or unemp > 6:
        level = 'moderate'
    else:
        level = 'stable'
    if debt > 90: reasons.append(f'Debt at {debt:.1f}% GDP — crisis territory')
    elif debt > 60: reasons.append(f'Debt at {debt:.1f}% GDP — monitor closely')
    if inf > 10: reasons.append(f'Hyperinflation risk: {inf:.1f}%')
    elif inf > 4: reasons.append(f'Elevated inflation: {inf:.1f}%')
    if unemp > 12: reasons.append(f'Severe unemployment: {unemp:.1f}%')
    elif unemp > 6: reasons.append(f'Elevated unemployment: {unemp:.1f}%')
    if gdp < 0: reasons.append(f'Negative GDP growth: {gdp:.1f}%')
    return level, reasons

def run_simulation(inputs, baselines=None):
    b = baselines or {'gdp':2.5,'unemployment':5.5,'inflation':3.0,'debt':65.0,'poverty':22.0}
    gdp_arr, unemp_arr, inf_arr, debt_arr, pov_arr = [], [], [], [], []
    running_debt = b['debt']

    for y in range(5):
        gdp_y = (b['gdp']
            + inputs['edu_spend']      * 0.30 * LAG['edu'][y]
            + inputs['infra_spend']    * 0.25 * LAG['infra'][y]
            + inputs['rd_spend']       * 0.20 * LAG['rd'][y]
            - inputs['income_tax']     * 0.15
            - inputs['corp_tax']       * 0.12
            + inputs['health_spend']   * 0.08 * LAG['health'][y]
            - inputs['subsidy']        * 0.05 * LAG['sub'][y])

        unemp_y = max(0, b['unemployment']
            - inputs['infra_spend']    * 0.40 * LAG['infra'][y]
            - inputs['edu_spend']      * 0.20 * LAG['edu'][y]
            + inputs['min_wage_delta'] * 0.15
            + inputs['corp_tax']       * 0.10)

        inf_y = (b['inflation']
            + inputs['subsidy']        * 0.35 * LAG['sub'][y]
            + inputs['min_wage_delta'] * 0.20
            - inputs['rd_spend']       * 0.10 * LAG['rd'][y]
            - inputs['infra_spend']    * 0.05)

        spend = (inputs['edu_spend'] + inputs['health_spend'] +
                 inputs['infra_spend'] + inputs['subsidy'] + inputs['rd_spend'])
        revenue = inputs['income_tax'] * 0.25 + inputs['corp_tax'] * 0.15
        running_debt = running_debt + (spend - revenue) * 0.4

        pov_y = max(0, min(100, b['poverty']
            - inputs['subsidy']      * 0.40
            - inputs['edu_spend']    * 0.25 * LAG['edu'][y]
            - inputs['health_spend'] * 0.20 * LAG['health'][y]
            + inputs['income_tax']   * 0.10
            - inputs['infra_spend']  * 0.08 * LAG['infra'][y]))

        gdp_arr.append(round(gdp_y, 2))
        unemp_arr.append(round(unemp_y, 2))
        inf_arr.append(round(inf_y, 2))
        debt_arr.append(round(running_debt, 2))
        pov_arr.append(round(pov_y, 2))

    gini = calc_gini(inputs)
    risk_level, risk_reasons = _risk(gdp_arr[0], unemp_arr[0], inf_arr[0], debt_arr[0])

    # Sensitivity: GDP impact of +1 unit per variable
    sensitivity = {}
    base_gdp = calc_gdp(inputs, b['gdp'])
    for var in ['edu_spend','infra_spend','rd_spend','health_spend','subsidy','income_tax','corp_tax','min_wage_delta']:
        mod = dict(inputs); mod[var] = inputs[var] + 1
        sensitivity[var] = round(calc_gdp(mod, b['gdp']) - base_gdp, 3)

    return {
        'gdp_growth': gdp_arr, 'unemployment': unemp_arr, 'inflation': inf_arr,
        'debt_pct_gdp': debt_arr, 'poverty_index': pov_arr, 'gini_coeff': gini,
        'risk_level': risk_level, 'risk_reasons': risk_reasons, 'sensitivity': sensitivity,
    }
