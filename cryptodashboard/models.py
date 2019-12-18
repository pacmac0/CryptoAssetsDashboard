from cryptodashboard import db, login_manager, bcrypt
from datetime import datetime
from flask_login import UserMixin, current_user


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


class User(db.Model, UserMixin):
    id = db.Column(db.String(40), primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    firstName = db.Column(db.String(40), nullable=False)
    lastName = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    profilePicture = db.Column(db.String(50), nullable=False, default='default_profile_picture.jpg')
    assets = db.relationship('Asset', backref='owner', lazy=True)

    def __repr__(self):
        return f"User('{self.id}', '{self.firstName}', '{self.lastName}', '{self.username}', '{self.email}', '{self.profilePicture}')"

    def __init__(self, id, username, firstName, lastName, email, password, profilePicture=None):
        self.id = id
        self.username = username
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.profilePicture = profilePicture

class Asset(db.Model):
    id = db.Column(db.String(40), primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.now)
    owner_id = db.Column(db.String(40), db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Asset('{self.id}', '{self.type}', '{self.amount}', '{self.owner_id}', '{self.date_added}')"

    def __init__(self, id, type, amount, price, owner_id, date_added=None):
        self.id = id
        self.type = type
        self.amount = amount
        self.price = price
        self.owner_id = owner_id
        self.date_added = date_added
