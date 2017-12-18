import bottle
import peewee
import voluptuous

from dashboard.utils import template
from dashboard.lang import Lang


@template('error.html')
def error_404_handler(error):
    print(error)
    return {'note': Lang.NOT_FOUND.auto, 'code': Lang.NOT_FOUND.code}


@template('error.html')
def error_400_handler(error):
    print(error)
    return {'note': Lang.REQUEST_INVALID.auto, 'code': Lang.REQUEST_INVALID.code}


def error_500_handler(error):
    exception = error.exception

    if isinstance(exception, peewee.DoesNotExist):
        print(error.body)
        return error_404_handler(error)

    elif isinstance(exception, voluptuous.error.Error):
        # 参数校验错误
        errors = []
        if isinstance(exception, voluptuous.error.MultipleInvalid):
            errors = exception.errors
        elif isinstance(exception, voluptuous.error.Invalid):
            errors = [exception]

        return error_400_handler(errors)


@template('error.html')
def default_error_handle(error: bottle.HTTPError):
    print(error)
    return {'note': Lang.FORBIDDEN.auto, 'code': Lang.FORBIDDEN.code}


def register_error_handler():
    app = bottle.default_app()
    app.error_handler[400] = default_error_handle
    app.error_handler[401] = default_error_handle
    app.error_handler[403] = default_error_handle
    app.error_handler[404] = error_404_handler
    app.error_handler[500] = error_500_handler
