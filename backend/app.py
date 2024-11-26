import json
import os
import jwt
from datetime import datetime, timedelta, timezone

from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import check_password_hash, generate_password_hash

from newsapi import NewsApiClient
from database import db
from models import User, Document
from sqlalchemy.exc import IntegrityError

load_dotenv()

app = Flask(__name__)
allowed_origins = ["http://localhost:3000"]
CORS(app, supports_credentials=True, origins=allowed_origins)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"]= os.getenv("SECRET_KEY")

db.init_app(app)
migrate = Migrate(app, db)

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin in allowed_origins:
        response.headers.add("Access-Control-Allow-Origin", origin)
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response

newsapi = NewsApiClient(api_key=os.getenv("NEWSAPI_API_KEY"))

def create_access_token(user_id):
    payload = {
        'user_id': str(user_id),
        'exp': datetime.now(timezone.utc) + timedelta(days=1)  
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def decode_access_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@app.route("/")
def index():
    return "Hello, World!"

@app.route("/api/auth/register", methods=["POST"])
def register():
    body = request.get_json()

    username = body.get("username")
    email = body.get("email")
    password = body.get("password")
    name = body.get("name")

    if not (username and email and password and name):
        return jsonify({"error": "All fields are required (username, email, password, & name)."}), 400

    try:
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, name=name, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
    except IntegrityError as e:
        db.session.rollback()
        if 'unique constraint' in str(e.orig):
            return jsonify({"error": "User with this email or username already exists."}), 400
        return jsonify({"error": "Database integrity error."}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred."}), 500
    
    return jsonify({"message": "User registered successfully."}), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found."}), 400
    elif not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid password."}), 400
    
    access_token = create_access_token(user.id)
    return jsonify({"message": "User logged in successfully.", "access_token": access_token, 
            "user": {
                "username" : user.username,
                "name": user.name,
                "createdAt": user.created_at,
            },}), 200

@app.route("/api/auth/protected", methods=["GET"])
def protected():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Access token missing."})
    
    token = token.split()[1]
    user_id = decode_access_token(token)

    if not user_id:
        return jsonify({"error": "Invalid or expired token."}), 401

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify(
        {"user": {
            "username" : user.username,
            "name": user.name,
            "createdAt": user.created_at,
            "frequency": user.frequency,
            "topics": user.topics,
            "regions": user.regions,
            "sources": user.sources,
        }, 
        "message": f"User is authenticated."}), 200

@app.route("/api/set-preferences", methods=["POST", "PATCH"])
def set_preferences():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Access token missing."}), 400

    token = token.split()[1]
    user_id = decode_access_token(token) 

    if not user_id:
        return jsonify({"error": "Invalid or expired token."}), 401

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found."}), 404
    
    body = request.get_json()

    if not body:
        return jsonify({"error": "No data provided."}), 400
    
    if request.method == "POST":
        topics = body.get("topics")
        sources = body.get("sources")
        regions = body.get("regions")
        frequency = body.get("frequency")  

        user.topics = topics
        user.sources = sources 
        user.regions = regions 
        user.frequency = frequency

    elif request.method == "PATCH":
        if "topics" in body:
            user.topics = body["topics"]
        if "sources" in body:
            user.sources = body["sources"]
        if "regions" in body:
            user.regions = body["regions"]
        if "frequency" in body:
            user.frequency = body["frequency"]

    db.session.commit()

    return jsonify({"message": "User preferences set.", "user": user.to_dict()}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)