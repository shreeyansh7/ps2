import os
from datetime import timedelta
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY            = os.getenv('SECRET_KEY', 'dev-secret')
    MONGO_URI             = os.getenv('MONGO_URI', 'mongodb://localhost:27017/policysim')
    JWT_SECRET_KEY        = os.getenv('JWT_SECRET_KEY', 'jwt-dev-secret')
    JWT_ACCESS_TOKEN_EXPIRES  = timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    DEBUG = os.getenv('FLASK_DEBUG', 'true').lower() == 'true'
