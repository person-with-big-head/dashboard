from enum import Enum

from bottle import request


class Lang(Enum):
    NOT_FOUND = (
        '啊哦，页面可能被怪物吃了:(',
        '404',
        'Don’t freak out... but we lost the page you were looking for :(')

    REQUEST_INVALID = (
        '好像漏了点什么，再仔细想想:(',
        '400',
        'Don’t freak out... but we lost the page you were looking for :(',
    )

    FORBIDDEN = (
        '走到了禁地，换条路试试:(',
        '403',
        'Don’t freak out... but we lost the page you were looking for :(',
    )

    USER_NOT_FOUND = (
        'Oops, something goes wrong. The username may be not in the earth.',
        '404',
        'Username does not exists.'
    )

    USERNAME_PASSWORD_UNMATCHED = (
        'Oops, something goes wrong. The password is not the wife of the username.',
        '403',
        'Username is not matched with password'
    )

    USER_NOT_ACTIVE = (
        'Oops, something goes wrong. ',
        '403',
        'User is not activated'
    )

    LOGIN_SUCCESS = (
        '登陆成功',
        '200',
        'Login success'
    )

    UNAUTHENTICATED = (
        '尚未登陆',
        '401',
        'Unauthenticated'
    )

    def __init__(self, lang_zh, code, lang_id=''):
        self.zh = lang_zh
        self._code = code
        self.id = lang_id
        self.default = self.id

    @property
    def auto(self):
        accept_language = request.headers.get('Accept-Language')
        if accept_language is None:
            return self.default
        accept_language = accept_language.lower()
        if accept_language.startswith('zh'):
            return self.zh
        if accept_language.startswith('id'):
            return self.id
        return self.default

    @property
    def code(self):
        return self._code
