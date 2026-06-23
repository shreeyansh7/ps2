import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth import auth_bp
from routes.simulation import simulation_bp
from routes.scenarios import scenarios_bp
from routes.countries import countries_bp
from routes.advisor import advisor_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
    JWTManager(app)
    app.register_blueprint(auth_bp,       url_prefix='/api/auth')
    app.register_blueprint(simulation_bp, url_prefix='/api')
    app.register_blueprint(scenarios_bp,  url_prefix='/api')
    app.register_blueprint(countries_bp,  url_prefix='/api')
    app.register_blueprint(advisor_bp,    url_prefix='/api')

    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'PolicySim API running'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
