from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.scenario import Scenario

scenarios_bp = Blueprint('scenarios', __name__)

@scenarios_bp.route('/scenarios', methods=['GET'])
@jwt_required()
def list_scenarios():
    return jsonify({'success': True, 'scenarios': Scenario.find_by_user(get_jwt_identity())})

@scenarios_bp.route('/scenarios', methods=['POST'])
@jwt_required()
def save_scenario():
    data = request.get_json(force=True, silent=True) or {}
    name = str(data.get('name','')).strip()
    if not name:
        return jsonify({'error': 'Scenario name required'}), 400
    try:
        s = Scenario.create(
            user_id=get_jwt_identity(), name=name,
            inputs=data.get('inputs',{}), outputs=data.get('outputs',{}),
            risk_level=data.get('risk_level','moderate'),
            description=data.get('description',''), base_country=data.get('base_country'),
        )
        return jsonify({'success': True, 'scenario': s}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@scenarios_bp.route('/scenarios/<sid>', methods=['GET'])
@jwt_required()
def get_scenario(sid):
    s = Scenario.find_by_id(sid)
    if not s: return jsonify({'error': 'Not found'}), 404
    return jsonify({'success': True, 'scenario': s})

@scenarios_bp.route('/scenarios/<sid>', methods=['DELETE'])
@jwt_required()
def delete_scenario(sid):
    if not Scenario.delete(sid, get_jwt_identity()):
        return jsonify({'error': 'Not found or unauthorized'}), 404
    return jsonify({'success': True})
