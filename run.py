from app import create_app

app = create_app()

if __name__ == '__main__':
    # To make a user an admin, you can do it manually in a Python shell:
    # from app import create_app
    # from app.models import db, User
    # app = create_app()
    # with app.app_context():
    #     user = User.query.filter_by(username='your_admin_username').first()
    #     if user:
    #         user.is_admin = True
    #         db.session.commit()
    #         print(f"User {user.username} is now an admin.")
    
    app.run(debug=True)