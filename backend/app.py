import os
import jwt
from datetime import datetime, timedelta, timezone

from flask import Flask, request, jsonify
from dotenv import load_dotenv
from werkzeug.security import check_password_hash, generate_password_hash

from newsapi import NewsApiClient

from db import db
from models import User

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SECRET_KEY']= os.getenv("SECRET_KEY")

db.init_app(app)

newsapi = NewsApiClient(api_key=os.getenv("NEWSAPI_API_KEY"))

def create_access_token(user_id):
    payload = {
        'user_id': str(user_id),
        'exp': datetime.now(timezone.utc) + timedelta(hours=1)
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
    if request.method == "POST":
        body = request.get_json()

        username = body.get("username")
        email = body.get("email")
        password = body.get("password")
        name = body.get("name")

        if not(username and email and password and name):
            return jsonify({"error": "All fields are required (username, email, password, & name)."}), 400

        try:
            hashed_password = generate_password_hash(password)
            new_user = User(username=username, name=name, email=email, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"Error" : str(e)}), 400
    
        return jsonify({"message": "User registered successfully."}), 201

@app.route("/api/auth/login", methods=["POST"])
def login():
    if request.method == "POST":
        body = request.get_json()
        
        email = body.get("email")
        password = body.get("password")

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "User not found."}), 400
        elif not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid password."}), 400
        
        access_token = create_access_token(user.id)
        return jsonify({"message": "User logged in successfully.", "access_token": access_token}), 200


@app.route("/api/auth/protected", methods=["GET"])
def protected():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({"error": "Access token missing."})
    
    token = token.split()[1]
    user_id = decode_access_token(token)

    if not user_id:
        return jsonify({"error": "Invalid or expired token."}), 401

    return jsonify({"message": f"User {user_id} is authenticated."}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)