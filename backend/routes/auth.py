from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(force=True, silent=True) or {}
    name = str(data.get('name','')).strip()
    email = str(data.get('email','')).strip().lower()
    password = str(data.get('password',''))
    if not all([name, email, password]):
        return jsonify({'error': 'All fields required'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Password must be 6+ characters'}), 400
    if User.find_by_email(email):
        return jsonify({'error': 'Email already registered'}), 409
    try:
        user = User.create(name, email, password)
        return jsonify({
            'success': True, 'user': User.to_public(user),
            'access_token': create_access_token(identity=str(user['_id'])),
            'refresh_token': create_refresh_token(identity=str(user['_id'])),
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True, silent=True) or {}
    email = str(data.get('email','')).strip().lower()
    password = str(data.get('password',''))
    user = User.find_by_email(email)
    if not user or not User.verify_password(password, user['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    User.update_last_login(str(user['_id']))
    return jsonify({
        'success': True, 'user': User.to_public(user),
        'access_token': create_access_token(identity=str(user['_id'])),
        'refresh_token': create_refresh_token(identity=str(user['_id'])),
    })

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    return jsonify({'access_token': create_access_token(identity=get_jwt_identity())})

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user = User.find_by_id(get_jwt_identity())
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': User.to_public(user)})
