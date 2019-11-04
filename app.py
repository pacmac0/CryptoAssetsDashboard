from flask import Flask, render_template, request, redirect, make_response, session, escape, url_for, jsonify
import os
from werkzeug.utils import secure_filename
import caller, database
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['secret_key'] = '\n/\xf5\xe4\x1a\x9e\x86V\xb9\xd6\xadl\xb5f8\xe1\xdb\xc5G\x05\xfa\xd5\xdf\xee'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

db = SQLAlchemy(app)

@app.route("/", methods=['GET'])
def serve_login():
    return render_template('login.html')


@app.route("/error/404", methods=['GET'])
def serve_error404():
    return render_template('404.html')


@app.route("/blank", methods=['GET'])
def blank():
    return render_template('blank.html')


@app.route("/buttons", methods=['GET'])
def buttons():
    return render_template('buttons.html')


@app.route("/cards", methods=['GET'])
def serve_cards():
    return render_template('cards.html')


@app.route("/charts", methods=['GET'])
def serve_charts():
    return render_template('charts.html')


@app.route("/forgot-password", methods=['GET'])
def serve_forgot_password():
    return render_template('forgot-password.html')


@app.route("/index", methods=['GET'])
def serve_index():
    return render_template('index.html')


@app.route("/register", methods=['GET'])
def serve_register():
    return render_template('register.html')


@app.route("/tables", methods=['GET'])
def serve_tables():
    return render_template('tables.html')


@app.route("/utilities-animation", methods=['GET'])
def serve_utilities_animation():
    return render_template('utilities-animation.html')


@app.route("/utilities-border", methods=['GET'])
def serve_utilities_border():
    return render_template('utilities-border.html')


@app.route("/utilities-color", methods=['GET'])
def serve_utilities_color():
    return render_template('utilities-color.html')


@app.route("/utilities-other", methods=['GET'])
def serve_utilities_other():
    return render_template('utilities-other.html')


def file_extension_allowed(filename):
    extensions = set(['csv'])
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions


@app.route("/dashboard", methods=['GET', 'POST'])
def login():

    #session['email'] = request.form['email']
    #session['password'] = request.form['password']
    #return redirect(url_for('serve_dashboard'))

    # if logged In
    #if session['password'] == "test":
    #    return redirect(url_for('serve_dashboard'))
    # if not logged In
    #else:
    return render_template('index.html')


@app.route("/upload", methods=['GET', 'POST'])
def upload():
    # folder path on windows
    uploads_folder_path = "C:\\Users\\test\\PycharmProjects\\CryptoAssets\\CryptoAssets\\venv\\include\\uploads"

    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file_extension_allowed(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(uploads_folder_path, filename))
            return redirect(request.url)

    return render_template('upload.html')


@app.route("/dataload", methods=['GET', 'POST'])
def dataload():
    payload = caller.crypto_data_call()
    return payload


@app.route("/logout")
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))


if __name__ == '__main__':


    app.run(port=1337, debug=True)  # TODO: turn off debug before deployment!!!!

