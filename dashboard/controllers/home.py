from bottle import get
from dashboard.utils import template
from dashboard.plugins import boilerplate_plugin


@get('/test', skip=[boilerplate_plugin])
@template('index.html')
def test():
    return {}
