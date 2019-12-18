from cryptodashboard import app, db, caller, bcrypt

if __name__ == '__main__':


    # DB init
    from cryptodashboard.models import User
    from cryptodashboard.models import Asset
    import uuid

    '''
    db.create_all()
    new_user = User(str(uuid.uuid1()), 'Pacmac', 'Fynn', 'van Westen', 'fynn.van-westen@gmx.de', 'test')
    new_asset = Asset(str(uuid.uuid1()), 'btc', 0.02, 7658.34,  new_user.id)
    db.session.add(new_user)
    db.session.add(new_asset)
    db.session.commit()
    #user = User.query.all()
    #asset = Asset.query.all()
    #print(user)
    #print(asset)
    #print(user[0].id == asset[0].owner_id)
    '''


    # user = User.query.first()
    # print(type(Asset.query.filter(Asset.owner_id == user.id).all()))
    # print(Asset.query.filter(Asset.owner_id == user.id).all())

    # TODO check https://coinmarketcap.com/widget/
    # TODO bugfix: reload new asset function for new coin if selected
    # TODO change assets to include USD value at the time

    app.run(port=1337, debug=True)  # TODO: turn off debug before deployment!!!!

