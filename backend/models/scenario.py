from datetime import datetime, timezone
from bson import ObjectId
from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()

def _db():
    c = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/policysim'))
    return c.get_database('policysim')

class Scenario:
    @staticmethod
    def create(user_id, name, inputs, outputs, risk_level, description='', base_country=None):
        db = _db()
        doc = {
            'user_id': ObjectId(user_id), 'name': name,
            'description': description, 'inputs': inputs, 'outputs': outputs,
            'risk_level': risk_level, 'base_country': base_country,
            'created_at': datetime.now(timezone.utc),
        }
        result = db.scenarios.insert_one(doc)
        doc['_id'] = str(result.inserted_id)
        doc['user_id'] = str(doc['user_id'])
        return doc

    @staticmethod
    def find_by_user(user_id):
        db = _db()
        items = list(db.scenarios.find({'user_id': ObjectId(user_id)}, sort=[('created_at',-1)]))
        for s in items:
            s['_id'] = str(s['_id']); s['user_id'] = str(s['user_id'])
        return items

    @staticmethod
    def find_by_id(scenario_id):
        try:
            s = _db().scenarios.find_one({'_id': ObjectId(scenario_id)})
            if s:
                s['_id'] = str(s['_id']); s['user_id'] = str(s['user_id'])
            return s
        except Exception:
            return None

    @staticmethod
    def delete(scenario_id, user_id):
        try:
            r = _db().scenarios.delete_one({'_id': ObjectId(scenario_id), 'user_id': ObjectId(user_id)})
            return r.deleted_count > 0
        except Exception:
            return False
