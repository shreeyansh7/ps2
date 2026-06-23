def calc_gdp(inputs, base=2.5):
    return (base
        + inputs['edu_spend']   * 0.30
        + inputs['infra_spend'] * 0.25
        + inputs['rd_spend']    * 0.20
        - inputs['income_tax']  * 0.15
        - inputs['corp_tax']    * 0.12
        + inputs['health_spend']* 0.08
        - inputs['subsidy']     * 0.05)

def calc_unemployment(inputs, base=5.5):
    return (base
        - inputs['infra_spend']    * 0.40
        - inputs['edu_spend']      * 0.20
        + inputs['min_wage_delta'] * 0.15
        + inputs['corp_tax']       * 0.10)

def calc_inflation(inputs, base=3.0):
    return (base
        + inputs['subsidy']        * 0.35
        + inputs['min_wage_delta'] * 0.20
        - inputs['rd_spend']       * 0.10
        - inputs['infra_spend']    * 0.05)

def calc_poverty(inputs, base=22.0):
    r = (base
        - inputs['subsidy']      * 0.40
        - inputs['edu_spend']    * 0.25
        - inputs['health_spend'] * 0.20
        + inputs['income_tax']   * 0.10
        - inputs['infra_spend']  * 0.08)
    return max(0.0, min(100.0, r))

def calc_gini(inputs, base=0.35):
    r = (base
        - inputs['edu_spend']      * 0.012
        - inputs['health_spend']   * 0.008
        - inputs['subsidy']        * 0.015
        + inputs['corp_tax']       * 0.003
        - inputs['min_wage_delta'] * 0.004)
    return round(max(0.0, min(1.0, r)), 3)
