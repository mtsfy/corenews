import os

from flask import Flask, request, jsonify, session
from dotenv import load_dotenv
from werkzeug.security import check_password_hash, generate_password_hash

from newsapi import NewsApiClient

from db import db
from models import User

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.secret_key = os.getenv("SECRET_KEY")

db.init_app(app)

newsapi = NewsApiClient(api_key=os.getenv("NEWSAPI_API_KEY"))

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

            session['username'] = username
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
        
        session.clear()
        session["user_id"] = user.id

        return jsonify({"message": "User logged in successfully."}), 200
        
@app.route("/api/auth/check-session", methods=["GET"])
def check_session():
    if "user_id" in session:
        return jsonify({"message": "User is logged in"}), 200
    else:
        return jsonify({"error": "User is not logged in"}), 401

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "User logged out successfully"}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)