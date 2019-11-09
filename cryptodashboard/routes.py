from flask import render_template, request, redirect, url_for, flash
from cryptodashboard import caller
from cryptodashboard.forms import RegistrationForm, LoginForm
from cryptodashboard import app, db, bcrypt
from cryptodashboard.models import User, Asset
from flask_login import login_user, current_user, logout_user, login_required
import uuid

# imported for file upload
import os
from werkzeug.utils import secure_filename

@app.route("/", methods=['GET'])
@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('dashboard'))
        else:
            flash(f'The credentials are incorrect, Please check email and password!', 'danger')
    return render_template('login.html', form=LoginForm())


@app.route("/forgot-password", methods=['GET'])
def serve_forgot_password():
    return render_template('forgot-password.html')


@app.route("/register", methods=['GET', 'POST'])
def serve_register():
    form = RegistrationForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
            # create new user in db
            user = User(id=str(uuid.uuid1()), username=form.username.data, firstName=form.firstName.data,
                        lastName=form.lastName.data, email=form.email.data, password=hashed_password)
            db.session.add(user)
            db.session.commit()
            # TODO: Email verification
            flash(f'Your account got created!', 'success')
            return redirect(url_for('serve_login'))
    return render_template('register.html', form=form)


@app.route("/dashboard", methods=['GET'])
@login_required
def dashboard():
    return render_template('dashboard.html')


@app.route("/dataload", methods=['GET'])
@login_required
def dataload():
    payload = caller.crypto_data_call()
    return payload


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('login'))
