import sqlite3
import uuid
from flask_sqlalchemy import SQLAlchemy


# create database and tables
def connectDb():
    global conn
    conn = sqlite3.connect('crypto_asset.db')
    global cursor
    cursor = conn.cursor()


def initDatabase():
    conn.execute('CREATE TABLE users (user_id NONE, username TEXT, pwrd TEXT)')
    conn.execute('CREATE TABLE assets (asset_id NONE, coin TEXT, amount FLOAT, user_id TEXT)')

    # admin user with asset
    cursor.execute('INSERT INTO users (user_id, username, pwrd) VALUES (?,?,?)', ('1a1858c8-e798-11e9-bde5-acde48001122', 'admin', 'adminPW'))
    cursor.execute('INSERT INTO assets (asset_id, coin, amount, user_id) VALUES (?,?,?,?)', (str(uuid.uuid1()), 'BTC', 2.5, '1a1858c8-e798-11e9-bde5-acde48001122'))
    conn.commit()


# fill database with initial infos
def addUser(name, passwd):
    cursor.execute('INSERT INTO users (username, pwrd) VALUES (?,?)', (str(uuid.uuid1()), name, passwd))
    conn.commit()


def getUsers():
    cursor.execute('SELECT * FROM users')
    rows = cursor.fetchall()
    return rows


def getAssetsOfUser(user_id):
    cursor.execute('SELECT * FROM assets WHERE user_id = user_id')
    rows = cursor.fetchall()
    return rows



if __name__ == '__main__':
    print('')