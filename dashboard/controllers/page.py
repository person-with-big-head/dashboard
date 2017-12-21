from bottle import get, redirect

from dashboard.auth import get_user
from dashboard.utils import template
from dashboard.plugins import boilerplate_plugin


@get(['/'], skip=[boilerplate_plugin])
@template('index.html')
def home():
    # print(request.get)
    if not get_user():
        redirect('/login')
    return {}


@get('/login', skip=[boilerplate_plugin])
@template('login.html')
def login():
    return {}
