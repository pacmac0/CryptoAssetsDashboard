from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, SelectField, FloatField
from wtforms.validators import DataRequired, Length, Email, EqualTo, NumberRange, AnyOf, ValidationError
from wtforms.widgets.html5 import NumberInput

from cryptodashboard.models import User


class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=20)])
    firstName = StringField('Firstname', validators=[DataRequired(), Length(min=2, max=40)])
    lastName = StringField('Lastname', validators=[DataRequired(), Length(min=2, max=40)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register Account')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('This username is taken, please choose a different one!')

    def validate_email(self, email):
        email = User.query.filter_by(email=email.data).first()
        if email:
            raise ValidationError('This email was used already once and is connected to a different account!')


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember me')
    submit = SubmitField('Login')


coinChoices = [('btc', 'Bitcoin(BTC)'), ('eth', 'Ethereum(ETH)'), ('iota', 'IOTA(MIOTA)'), ('xrp', 'Ripple(XRP)'), ('bch', 'Bitcoin Cash(BCH)'), ('usdt', 'Tether(USDT)')]
class changeAssetsForm(FlaskForm):
    type = SelectField('Coin', choices=coinChoices, validators=[DataRequired(), AnyOf([coin[0] for coin in coinChoices])]) #change here for supported coins
    action = SelectField('Action', choices=[('buy', 'bought'), ('sell', 'sold')], validators=[DataRequired(), AnyOf(['buy', 'sell'])])
    amount = FloatField('Amount', validators=[DataRequired(), NumberRange(min=0)], default=0.0)
    submit = SubmitField('Create')

