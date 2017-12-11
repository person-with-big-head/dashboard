from datetime import datetime

import bottle
import jwt
import logging
import peewee
from bottle import request, abort

from dashboard.lang import Lang
from dashboard.models import User, Session, APIUser

app = bottle.default_app()


def get_user():
    """
    :rtype: dashboard.models.User
    """
    auth_header = request.headers.get('Authorization', None)
    if auth_header is None:
        return

    parts = auth_header.split()

    if len(parts) != 2:
        logging.error('invalid auth header: %s', auth_header)
        return
    elif parts[0].lower() != 'bearer':
        logging.error('invalid auth header: %s', auth_header)
        return

    token = parts[1]

    try:
        payload = jwt.decode(token, app.config['user.jwt_key'])
    except jwt.DecodeError:
        logging.error('invalid auth header: %s', auth_header)
        return

    try:
        session = (Session
                   .select(Session, User)
                   .join(User)
                   .where(Session.id == payload['session_id'])
                   .get())
    except peewee.DoesNotExist:
        return

    if datetime.now() > session.expire_at:
        return
    return session.user


def get_user_or_401():
    user = get_user()
    if user is None:
        abort(401, Lang.UNAUTHENTICATED.auto)
    return user


def check_user():
    get_user_or_401()


def get_api_user():
    """
    :rtype: dashboard.models.APIUser
    """
    token, _ = request.auth or (None, None)
    if token is None:
        return

    try:
        user = APIUser.get(APIUser.token == token)
        if user.expire_at is not None and datetime.now() > user.expire_at:
            return
        return user
    except peewee.DoesNotExist:
        return


def get_api_user_or_401():
    user = get_api_user()
    if user is None:
        headers = {'WWW-Authenticate': 'Basic realm="battlefront"'}
        raise bottle.HTTPError(401, Lang.UNAUTHENTICATED.auto, **headers)


def check_api_user():
    get_api_user_or_401()
