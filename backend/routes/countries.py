from flask import Blueprint, jsonify
from simulation.presets import get_all_presets, get_preset

countries_bp = Blueprint('countries', __name__)

@countries_bp.route('/countries', methods=['GET'])
def list_countries():
    return jsonify({'success': True, 'countries': get_all_presets()})

@countries_bp.route('/countries/<code>', methods=['GET'])
def get_country(code):
    preset = get_preset(code)
    if not preset: return jsonify({'error': f'Country {code} not found'}), 404
    return jsonify({'success': True, 'country': preset})
