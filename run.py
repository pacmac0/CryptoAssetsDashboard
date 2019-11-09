from cryptodashboard import app, db

if __name__ == '__main__':

    # DB init

    from cryptodashboard.models import User
    db.create_all()
    print(User.query.all())


    app.run(port=1337, debug=True)  # TODO: turn off debug before deployment!!!!

