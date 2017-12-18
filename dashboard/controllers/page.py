from bottle import get
from dashboard.utils import template
from dashboard.plugins import boilerplate_plugin


@get('/dashboard', skip=[boilerplate_plugin])
@template('index.html')
def home():
    return {}


@get('/dashboard/table', skip=[boilerplate_plugin])
@template('tables.html')
def table():
    return {}
