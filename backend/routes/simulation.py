from flask import Blueprint, request, jsonify
from simulation.engine import run_simulation
from simulation.validator import validate_inputs
from simulation.presets import get_preset
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timezone
import os, uuid
load_dotenv()

simulation_bp = Blueprint('simulation', __name__)

def _db():
    c = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/policysim'))
    return c.get_database('policysim')

@simulation_bp.route('/simulate', methods=['POST'])
def simulate():
    data = request.get_json(force=True, silent=True) or {}
    inputs = data.get('inputs', {})
    country_code = data.get('country_code')
    is_valid, errors, warnings = validate_inputs(inputs)
    if not is_valid:
        return jsonify({'success': False, 'errors': errors}), 400
    baselines = None
    if country_code:
        preset = get_preset(country_code)
        if preset: baselines = preset.get('baselines')
    try:
        out = run_simulation(inputs, baselines)
        sid = str(uuid.uuid4())[:8]
        try:
            _db().simulation_logs.insert_one({
                'simulation_id': sid, 'inputs': inputs,
                'risk_level': out['risk_level'], 'created_at': datetime.now(timezone.utc),
            })
        except Exception:
            pass
        return jsonify({
            'success': True,
            'outputs': {
                'gdp_growth': out['gdp_growth'], 'unemployment': out['unemployment'],
                'inflation': out['inflation'], 'debt_pct_gdp': out['debt_pct_gdp'],
                'poverty_index': out['poverty_index'], 'gini_coeff': out['gini_coeff'],
            },
            'risk_level': out['risk_level'], 'risk_reasons': out['risk_reasons'],
            'sensitivity': out['sensitivity'], 'warnings': warnings, 'simulation_id': sid,
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
