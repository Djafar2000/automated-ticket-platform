from flask import Blueprint, request, jsonify, render_template
from .models import db, User, Transaction
from .utils.decorators import admin_required
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .bot.ticket_bot import TicketBot

main_bp = Blueprint('main_bp', __name__)

# --- User Authentication Routes ---
@main_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 409

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201

@main_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token)
          
    return jsonify({"msg": "Bad username or password"}), 401

# --- Bot Control Route ---
@main_bp.route('/start-bot', methods=['POST'])
@jwt_required()
def start_bot():
    user_id = get_jwt_identity()
    data = request.get_json()
    event_name = data.get('event_name')
    # For simplicity, we use a placeholder URL.
    ticket_url = data.get('ticket_url', 'https://www.google.com') 

    if not event_name:
        return jsonify({"msg": "Event name is required"}), 400

    # Log the transaction attempt
    transaction = Transaction(user_id=user_id, event_name=event_name, status='pending')
    db.session.add(transaction)
    db.session.commit()

    # Run the bot (this runs synchronously for simplicity)
    bot = TicketBot()
    status = bot.run_purchase_flow(event_name, ticket_url)

    # Update transaction status
    transaction.status = status
    db.session.commit()

    return jsonify({"msg": f"Bot finished with status: {status}", "transaction_id": transaction.id})

# --- Admin Routes ---
@main_bp.route('/admin/users', methods=['GET'])
@admin_required()
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@main_bp.route('/admin/transactions', methods=['GET'])
@admin_required()
def get_all_transactions():
    transactions = Transaction.query.order_by(Transaction.timestamp.desc()).all()
    return jsonify([tx.to_dict() for tx in transactions])
@main_bp.route('/')
def index():
    # This will serve our main dashboard page (index.html)
    return render_template('index.html')

@main_bp.route('/login-page')
def login_page():
    # This will serve our login page
    return render_template('login.html')