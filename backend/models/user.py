from datetime import datetime, timezone
import bcrypt
from bson import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()

def _db():
    c = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/policysim'))
    return c.get_database('policysim')

class User:
    @staticmethod
    def create(name, email, password, role='user'):
        db = _db()
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        doc = {
            'name': name, 'email': email.lower().strip(),
            'password': hashed.decode('utf-8'), 'role': role,
            'created_at': datetime.now(timezone.utc), 'last_login': None,
        }
        result = db.users.insert_one(doc)
        doc['_id'] = str(result.inserted_id)
        return doc

    @staticmethod
    def find_by_email(email):
        return _db().users.find_one({'email': email.lower().strip()})

    @staticmethod
    def find_by_id(user_id):
        try:
            return _db().users.find_one({'_id': ObjectId(user_id)})
        except Exception:
            return None

    @staticmethod
    def verify_password(plain, hashed):
        try:
            return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
        except Exception:
            return False

    @staticmethod
    def update_last_login(user_id):
        try:
            _db().users.update_one({'_id': ObjectId(user_id)},
                {'$set': {'last_login': datetime.now(timezone.utc)}})
        except Exception:
            pass

    @staticmethod
    def to_public(user):
        return {
            'id': str(user.get('_id','')), 'name': user.get('name',''),
            'email': user.get('email',''), 'role': user.get('role','user'),
        }
