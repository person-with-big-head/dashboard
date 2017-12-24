import datetime
import base64
from bottle import post, response, redirect, get, abort, request, default_app

from dashboard.validators import login_validator
from dashboard.models import Authors, CaptchaCode, Session
from dashboard.lang import Lang
from dashboard.plugins import boilerplate_plugin
from dashboard.utils import plain_forms, plain_query, url_add_params, draw_captcha


@post('/v1/auth/login')
def login():

    args = login_validator(plain_forms())

    captcha = args['captcha']
    passport = request.get_cookie('id')
    token = request.get_cookie('passport')

    if not passport or not token or not CaptchaCode.check_captcha(token, passport, captcha):
        return {
            'code': Lang.CAPTCHA_ERROR.code,
            'text': Lang.CAPTCHA_ERROR.auto,
        }

    user = Authors.get_or_none(Authors.author_name == args['username'])

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

    app = default_app()

    session, expire_at = user.login()

    redirect_url = app.config['root.url'] + '/v1/auth/login_success'
    redirect_url = url_add_params(redirect_url, {
        'ticket': session.id,
    })

    return {
        'code': Lang.LOGIN_SUCCESS.code,
        'text': Lang.LOGIN_SUCCESS.auto,
        'redirect_url': redirect_url,
    }


@get('/v1/auth/verify_code', skip=[boilerplate_plugin])
def create_verify_code():

    args = plain_query()
    token = args.get('token')
    if not token:
        abort(403, "Missing token.")

    capture, key = draw_captcha()

    expire_at = datetime.datetime.now() + datetime.timedelta(seconds=60 * 3)
    cap_code = CaptchaCode.create(key=key, expire_at=expire_at)
    cookie = CaptchaCode.create_cookie(cap_code.id, key, token)
    cap_code.cookie = cookie
    cap_code.save()

    app = default_app()

    response.set_cookie('passport', cookie, path='/', domain=app.config['root.url'],
                        expires=expire_at, httponly=True)
    response.set_cookie('id', token, path='/', domain=app.config['root.url'],
                        expires=expire_at, httponly=True)

    with open(capture, 'rb') as img_f:
        img_stream = img_f.read()
        img_stream = base64.b64encode(img_stream)
    return img_stream


@get('/v1/auth/login_success')
def login_success():

    args = plain_query()
    ticket = args.get('ticket')
    session = Session.get_or_none(Session.id == ticket)

    if not ticket or not session:
        redirect('/login')

    app = default_app()

    token = "bearer " + session.jwt_token()
    response.set_cookie('token', token, path='/', domain=app.config['root.url'],
                        expires=session.expire_at, httponly=True)
    return redirect('/')
