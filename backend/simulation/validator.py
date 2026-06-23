RANGES = {
    'income_tax':(0,60),'corp_tax':(0,45),'edu_spend':(1,15),
    'health_spend':(1,20),'infra_spend':(0.5,10),'subsidy':(0,8),
    'min_wage_delta':(-10,50),'rd_spend':(0,5),
}

def validate_inputs(inputs):
    errors, warnings = [], []
    for field,(mn,mx) in RANGES.items():
        if field not in inputs:
            errors.append(f'Missing: {field}'); continue
        v = inputs[field]
        if not isinstance(v,(int,float)):
            errors.append(f'{field} must be a number')
        elif v < mn or v > mx:
            errors.append(f'{field} must be {mn}-{mx}')
    if errors: return False, errors, warnings
    spend = inputs['edu_spend']+inputs['health_spend']+inputs['infra_spend']+inputs['subsidy']+inputs['rd_spend']
    if spend > 40: warnings.append(f'Total spending {spend:.1f}% GDP is very high')
    inf_est = 3.0 + inputs['subsidy']*0.35 + inputs['min_wage_delta']*0.20
    if inf_est > 15: warnings.append(f'Hyperinflation risk: ~{inf_est:.1f}%')
    if inf_est < -2: warnings.append('Deflation risk')
    return True, errors, warnings
