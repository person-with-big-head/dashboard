from bottle import get, static_file
from dashboard.plugins import boilerplate_plugin


@get('/static/css/<file_path:re:.*\.css>', skip=[boilerplate_plugin])
def css(file_path):
    return static_file(file_path, root='../website/static/css/')


@get('/static/fonts/<file_path:re:.*\.(eot|otf|svg|ttf|woff|woff2)>', skip=[boilerplate_plugin])
def fonts(file_path):
    return static_file(file_path, root='../website/static/fonts/')


@get('/static/images/<file_path:re:.*\.(jpg|png|gif|ico|svg)>', skip=[boilerplate_plugin])
def images(file_path):
    return static_file(file_path, root='../website/static/images/')


@get('/static/js/<file_path:re:.*\.js>', skip=[boilerplate_plugin])
def js(file_path):
    return static_file(file_path, root='../website/static/js')


@get('/static/json/<file_path:re:.*\.json>', skip=[boilerplate_plugin])
def json(file_path):
    return static_file(file_path, root='../website/static/json')


@get('/static/layui/<file_path:re:.*>', skip=[boilerplate_plugin])
def layui(file_path):
    return static_file(file_path, root='../website/static/layui')


@get('/static/uploads/<year:re:[0-9]{4}>/<month:re:[0-9]{2}>/<file_path:re:.*\.(jpg|png|gif|ico|svg|jpeg)>',
     skip=[boilerplate_plugin])
def upload(file_path, year, month):
    return static_file(file_path, root='../website/static/uploads/%s/%s' % (year, month))

