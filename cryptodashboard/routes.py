from flask import render_template, request, redirect, url_for, flash, make_response
from cryptodashboard import caller
from cryptodashboard.forms import RegistrationForm, LoginForm, changeAssetsForm
from cryptodashboard import app, db, bcrypt
from cryptodashboard.models import User, Asset
from flask_login import login_user, current_user, logout_user, login_required
import uuid

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
def forgot_password():
    return render_template('forgot-password.html')


@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            # create new user in db
            user = User(id=str(uuid.uuid1()), username=form.username.data, firstName=form.firstName.data,
                        lastName=form.lastName.data, email=form.email.data, password=form.password.data)
            db.session.add(user)
            db.session.commit()
            # TODO: Email verification
            flash(f'Your account got created!', 'success')
            return redirect(url_for('login'))
    return render_template('register.html', form=form)


@app.route("/dashboard", methods=['GET'])
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user, coindata=dataload(), form=changeAssetsForm(), assets=assetload_by_user())


@app.route("/dataload", methods=['GET'])
@login_required
def dataload():
    payload = caller.crypto_data_call()
    return payload


def assetload_by_user():
    return Asset.query.filter(Asset.owner_id == current_user.id).all()


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route("/asset/new", methods=['POST'])
@login_required
def new_asset():
    form = changeAssetsForm()
    if form.validate_on_submit():
        if form.action.data == 'buy':
            db.session.add(Asset(str(uuid.uuid1()), form.type.data, form.amount.data, current_user.id))
            db.session.commit()
        if form.action.data == 'sell':
            db.session.add(Asset(str(uuid.uuid1()), form.type.data, form.amount.data*(-1), current_user.id))
            db.session.commit()
        flash(f'Your Asset got added successfully!', 'success')
    else:
        flash(f'Your Asset could not be added, please try again and control your input!', 'danger')
    return redirect(request.referrer)

@app.route("/asset/delete", methods=['POST'])
@login_required
def delete_asset():
    # asset id in request data
    if Asset.query.filter_by(id=request.get_data().decode()).first():
        db.session.delete(Asset.query.filter_by(id=request.get_data().decode()).first_or_404())
        db.session.commit()
        print('Asset created')
    return redirect(url_for('dashboard'))