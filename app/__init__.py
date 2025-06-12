
import os
from flask import Flask
from flask_cors import CORS  # <-- Importing CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config
from .models import db

# Initialize extensions
migrate = Migrate()
jwt = JWTManager()

def create_app():
    
    basedir = os.path.abspath(os.path.dirname(__file__))
    template_dir = os.path.join(os.path.dirname(basedir), 'templates')

    app = Flask(__name__, template_folder=template_dir)
    CORS(app)  # <-- Initialize CORS with our app

    app.config.from_object(Config)

    db.init_app(app, db)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from .routes import main_bp
    app.register_blueprint(main_bp)

    with app.app_context():
        db.create_all()

    return app