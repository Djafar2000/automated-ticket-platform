import os

from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-very-secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'a-super-secret-jwt-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db' # Simple SQLite database
    SQLALCHEMY_TRACK_MODIFICATIONS = False