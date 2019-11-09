from cryptodashboard import db, login_manager
from datetime import datetime
from flask_login import UserMixin


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
    profileImage = db.Column(db.String(50), nullable=False, default='default_profile_image.jpg')
    assets = db.relationship('Asset', backref='owner', lazy=True)

    def __repr__(self):
        return f"User('{self.id}', '{self.firstName}', '{self.lastName}', '{self.username}', '{self.email}', '{self.profileImage}')"

class Asset(db.Model):
    id = db.Column(db.String(40), primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Asset('{self.id}', '{self.type}', '{self.amount}', '{self.date_added}')"