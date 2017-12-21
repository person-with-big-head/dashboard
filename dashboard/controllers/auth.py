from bottle import post, response, redirect, get, request

from dashboard.validators import login_validator
from dashboard.utils import plain_forms, plain_query
from dashboard.models import User
from dashboard.lang import Lang


@get('/v1/auth/login')
def login():
    args = login_validator(plain_query())
    user = User.get_or_none(User.username == args['username'])
    if not user:
        return {
            'code': Lang.USER_NOT_FOUND.code,
            'text': Lang.USER_NOT_FOUND.auto
        }

    if not user.check_password(args['password']):
        return {
            'code': Lang.USERNAME_PASSWORD_UNMATCHED.code,
            'text': Lang.USERNAME_PASSWORD_UNMATCHED.auto,
        }

    if not user.is_valid():
        return {
            'code': Lang.USER_NOT_ACTIVE.code,
            'text': Lang.USER_NOT_ACTIVE.auto,
        }

    session, expire_at = user.login()

    # response.set_cookie('token', "bearer " + session.jwt_token(), path='/', expires=expire_at)
    # response.set_header('Location', '/')
    # response.set_header('Authorization', session.jwt_token())
    # response.status = 303
    # print(request.headers)
    # response.headers['']
    redirect('/', 302)
    return 302

