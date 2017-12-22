import datetime
from bottle import post, response, redirect, get

from dashboard.validators import login_validator
from dashboard.models import User, CaptchaCode, Session
from dashboard.lang import Lang
from dashboard.plugins import boilerplate_plugin
from dashboard.utils import plain_forms, plain_query, url_add_params, draw_captcha


@post('/v1/auth/login')
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

    if not user.is_valid():
        return {
            'code': Lang.USER_NOT_ACTIVE.code,
            'text': Lang.USER_NOT_ACTIVE.auto,
        }

    session, expire_at = user.login()

    redirect_url = 'http://127.0.0.1:1110/v1/auth/login_success'
    redirect_url = url_add_params(redirect_url, {
        'ticket': session.ticket,
    })

    return {
        'code': Lang.LOGIN_SUCCESS.code,
        'text': Lang.LOGIN_SUCCESS.auto,
        'redirect_url': redirect_url,
    }


@get('/v1/auth/verify_code', skip=[boilerplate_plugin])
def create_verify_code():
    capture, key = draw_captcha()

    expire_at = datetime.datetime.now() + datetime.timedelta(seconds=60 * 3)
    cap_code = CaptchaCode.create(key=key, expire_at=expire_at)
    cookie = CaptchaCode.create_cookie(cap_code.id, key)
    cap_code.cookie = cookie
    cap_code.save()

    return capture


@get('/v1/auth/login_success')
def login_success():

    args = plain_query()
    ticket = args.get('ticket')
    session = Session.get_or_none(Session.id == ticket)
    if not ticket or not session:
        redirect('/login')

    token = "bearer " + session.jwt_token()
    response.set_cookie('token', token, path='/', domain='127.0.0.1',
                        expires=session.expire_at, httponly=True)
    return redirect('/')
