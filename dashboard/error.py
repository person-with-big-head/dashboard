import json

import bottle
import peewee
import voluptuous
import elasticsearch
from bottle import response


from dashboard.lang import Lang


def error_500_handler(error):
    exception = error.exception

    result = {'error': {'message': error.body}}

    if isinstance(exception, peewee.DoesNotExist):
        response.status = 404
        result['error']['message'] = Lang.NOT_FOUND.auto

    elif isinstance(exception, elasticsearch.exceptions.NotFoundError):
        response.status = 404
        result['error']['message'] = Lang.NOT_FOUND.auto

    elif isinstance(exception, voluptuous.error.Error):
        # 参数校验错误
        errors = []
        if isinstance(exception, voluptuous.error.MultipleInvalid):
            errors = exception.errors
        elif isinstance(exception, voluptuous.error.Invalid):
            errors = [exception]

        response.status = 400
        result['error']['message'] = Lang.PARAM_INVALID.auto
        invalid_params = ['.'.join(map(str, e.path))
                          for e in errors if e.path]
        if invalid_params:
            result['error']['params'] = invalid_params

    response.content_type = 'application/json'
    return json.dumps(result)


def default_error_handle(error: bottle.HTTPError):
    response.content_type = 'application/json'
    return json.dumps({'error': {'message': error.body}})


def register_error_handler():
    app = bottle.default_app()
    app.error_handler[400] = default_error_handle
    app.error_handler[401] = default_error_handle
    app.error_handler[403] = default_error_handle
    app.error_handler[404] = default_error_handle
    app.error_handler[500] = error_500_handler
