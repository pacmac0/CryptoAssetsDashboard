from cryptodashboard import app, db, caller, bcrypt

if __name__ == '__main__':


    # DB init
    from cryptodashboard.models import User
    from cryptodashboard.models import Asset
    import uuid
    '''
    db.create_all()
    new_user = User(str(uuid.uuid1()), 'Pacmac', 'Fynn', 'van Westen', 'fynn.van-westen@gmx.de', 'test')
    new_asset = Asset(str(uuid.uuid1()), 'btc', 0.02, new_user.id)
    db.session.add(new_user)
    db.session.add(new_asset)
    db.session.commit()
    user = User.query.all()
    asset = Asset.query.all()
    print(user)
    print(asset)
    print(user[0].id == asset[0].owner_id)
    '''

    # TODO check https://coinmarketcap.com/widget/

    app.run(port=1337, debug=True)  # TODO: turn off debug before deployment!!!!

