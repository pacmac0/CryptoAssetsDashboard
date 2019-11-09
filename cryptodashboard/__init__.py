from flask import Flask
from cryptodashboard import caller
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SECRET_KEY'] = 'c232391917f0d9c85ff50982e1daa322'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cryptoDashboard.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

# import routes here to avoid circular imports (routes imports app imports routs and so on...)
from cryptodashboard import routes