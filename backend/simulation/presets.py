PRESETS = {
    'IN': {
        'name':'India','code':'IN','flag_emoji':'🇮🇳',
        'description':'High subsidy, growing infrastructure',
        'economic_context':'Rapidly developing economy',
        'policy_profile':{'income_tax':20,'corp_tax':25,'edu_spend':4.5,'health_spend':3.5,'infra_spend':5.0,'subsidy':4.0,'min_wage_delta':5,'rd_spend':0.7},
        'baselines':{'gdp':6.5,'unemployment':7.8,'inflation':5.5,'debt':83.0,'poverty':28.0}
    },
    'US': {
        'name':'United States','code':'US','flag_emoji':'🇺🇸',
        'description':'Market-led, innovation driven',
        'economic_context':'High private sector, high inequality',
        'policy_profile':{'income_tax':22,'corp_tax':21,'edu_spend':5.0,'health_spend':8.5,'infra_spend':2.5,'subsidy':1.5,'min_wage_delta':0,'rd_spend':3.1},
        'baselines':{'gdp':2.5,'unemployment':3.9,'inflation':3.2,'debt':120.0,'poverty':12.0}
    },
    'SE': {
        'name':'Sweden','code':'SE','flag_emoji':'🇸🇪',
        'description':'Nordic welfare model',
        'economic_context':'High equality, strong safety nets',
        'policy_profile':{'income_tax':52,'corp_tax':20,'edu_spend':7.7,'health_spend':11.0,'infra_spend':4.0,'subsidy':2.0,'min_wage_delta':0,'rd_spend':3.4},
        'baselines':{'gdp':2.2,'unemployment':8.5,'inflation':2.1,'debt':44.0,'poverty':8.5}
    },
    'SG': {
        'name':'Singapore','code':'SG','flag_emoji':'🇸🇬',
        'description':'Low tax, high efficiency',
        'economic_context':'City-state, productivity-led growth',
        'policy_profile':{'income_tax':11,'corp_tax':17,'edu_spend':2.8,'health_spend':4.5,'infra_spend':7.0,'subsidy':0.5,'min_wage_delta':0,'rd_spend':2.0},
        'baselines':{'gdp':3.5,'unemployment':2.1,'inflation':2.8,'debt':130.0,'poverty':5.0}
    },
    'BR': {
        'name':'Brazil','code':'BR','flag_emoji':'🇧🇷',
        'description':'Emerging market, high inequality',
        'economic_context':'Structural inequalities, fiscal pressures',
        'policy_profile':{'income_tax':27.5,'corp_tax':34,'edu_spend':6.0,'health_spend':9.5,'infra_spend':2.0,'subsidy':3.5,'min_wage_delta':2,'rd_spend':1.2},
        'baselines':{'gdp':1.8,'unemployment':9.5,'inflation':4.8,'debt':90.0,'poverty':26.0}
    }
}

def get_all_presets():
    return [{'name':v['name'],'code':v['code'],'flag_emoji':v['flag_emoji'],'description':v['description'],'economic_context':v['economic_context']} for v in PRESETS.values()]

def get_preset(code):
    return PRESETS.get(code.upper())
