from bottle import post

from dashboard.validators import login_validator
from dashboard.utils import plain_forms
from dashboard.models import User
from dashboard.lang import Lang


@post('/dashboard/auth/login')
def login():
    args = login_validator(plain_forms())
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

    if not user.valid():
        return {
            'code': Lang.USER_NOT_ACTIVE.code,
            'text': Lang.USER_NOT_ACTIVE.auto,
        }

    session = user.login()
    return {
        'code': Lang.LOGIN_SUCCESS.code,
        'text': Lang.LOGIN_SUCCESS.auto,
        'token': session.jwt_token()
    }
