RULES = {
    'reduce_poverty': {
        'keywords': ['poverty','poor','inequality','gini','low income'],
        'adjustments': {'subsidy':2.0,'edu_spend':1.5,'health_spend':1.0,'min_wage_delta':5},
        'explanation': 'Increase subsidies for direct relief, education for long-term mobility, healthcare to prevent poverty traps, and minimum wage to lift floor incomes.',
        'causal_chain': ['Subsidies -> immediate income support for lowest quintile','Education -> skills -> higher wages in 3-5 years','Healthcare -> fewer catastrophic costs -> less poverty trap','Min wage -> wage floor rises -> direct income increase'],
    },
    'reduce_debt': {
        'keywords': ['debt','deficit','fiscal','austerity','budget'],
        'adjustments': {'edu_spend':-1.0,'health_spend':-1.0,'subsidy':-1.5,'income_tax':3,'corp_tax':2},
        'explanation': 'Trim spending with diminishing returns while raising tax revenue. Avoid excessive austerity which can reduce GDP and worsen the debt-to-GDP ratio.',
        'causal_chain': ['Spending cuts -> lower outlays -> smaller deficit','Tax increases -> higher revenue -> faster debt paydown','Trade-off: austerity may slow growth short-term'],
    },
    'reduce_unemployment': {
        'keywords': ['unemployment','jobs','employment','workers','labor'],
        'adjustments': {'infra_spend':2.0,'edu_spend':1.0,'corp_tax':-3,'rd_spend':0.5},
        'explanation': 'Infrastructure creates direct jobs immediately, corporate tax cuts encourage hiring, education reduces structural unemployment, R&D creates high-skill jobs.',
        'causal_chain': ['Infrastructure -> construction jobs (immediate)','Corp tax cut -> increased hiring capacity','Education -> skill matching -> less structural unemployment','R&D -> innovation jobs -> new industries'],
    },
    'control_inflation': {
        'keywords': ['inflation','prices','cost of living','deflation'],
        'adjustments': {'subsidy':-2.0,'min_wage_delta':-3,'rd_spend':1.0},
        'explanation': 'Reduce subsidies that expand money supply, moderate wage growth to limit wage-push inflation, invest in R&D for productivity gains which are deflationary.',
        'causal_chain': ['Subsidy reduction -> less monetary expansion -> lower demand-pull inflation','Wage moderation -> lower production costs -> slower price growth','R&D -> productivity gains -> supply increases -> prices stabilise'],
    },
    'grow_gdp': {
        'keywords': ['growth','gdp','economy','develop','expand','productivity'],
        'adjustments': {'edu_spend':1.5,'rd_spend':1.0,'infra_spend':1.5,'corp_tax':-2,'income_tax':-2},
        'explanation': 'Invest in the three highest GDP multipliers: education (0.30x), infrastructure (0.25x), R&D (0.20x). Reduce tax drag on consumption and investment.',
        'causal_chain': ['Education -> human capital -> sustained productivity','Infrastructure -> reduced transaction costs -> business efficiency','R&D -> innovation -> new industries','Tax cuts -> disposable income -> consumption growth'],
    },
}

def get_advice(goal_text):
    goal_lower = goal_text.lower()
    best, best_score = None, 0
    for key, rule in RULES.items():
        score = sum(1 for kw in rule['keywords'] if kw in goal_lower)
        if score > best_score:
            best_score = score; best = (key, rule)
    if not best or best_score == 0:
        return {'matched': False, 'message': 'Try describing your goal in terms of: poverty, debt, unemployment, inflation, or GDP growth.'}
    key, rule = best
    return {'matched': True, 'goal': key, 'adjustments': rule['adjustments'], 'explanation': rule['explanation'], 'causal_chain': rule['causal_chain']}
