from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ai_advisor.advisor import get_advice

advisor_bp = Blueprint('advisor', __name__)

@advisor_bp.route('/advisor', methods=['POST'])
@jwt_required()
def advise():
    data = request.get_json(force=True, silent=True) or {}
    goal = str(data.get('goal','')).strip()
    if not goal: return jsonify({'error': 'Goal required'}), 400
    return jsonify({'success': True, 'advice': get_advice(goal)})
