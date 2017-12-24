from bottle import get, redirect

from dashboard.auth import get_user
from dashboard.utils import template
from dashboard.plugins import boilerplate_plugin


@get(['/'], skip=[boilerplate_plugin])
@template('index.html')
def home():
    user = get_user()
    if not user:
        redirect('/login')

    return {'username': user.author_name, 'user_avatar': user.author_avatar}


@get('/login', skip=[boilerplate_plugin])
@template('login.html')
def login():
    return {}
