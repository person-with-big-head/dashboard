import os
from enum import Enum

import re
from bottle import request

import functools
from bottle import jinja2_view

from dashboard import snowflake

from bs4 import BeautifulSoup


def _plain_args(d, list_fields=None):
    list_fields = list_fields or ()

    result = dict((key, d.getunicode(key).strip()) for key in d)
    for key in list_fields:
        result[key] = [v.strip() for v in d.getall(key)]

    return result


def plain_forms(list_fields=None):
    """ Plain POST data. """
    return _plain_args(request.forms, list_fields)


def plain_query(list_fields=None):
    """ Plain GET data """
    return _plain_args(request.query, list_fields)


def plain_params(list_fields=None):
    """ Plain all data """
    return _plain_args(request.params, list_fields)


id_generator = snowflake.generator(1, 1)


def idg():
    return next(id_generator)


def mask(s, start=0, end=None, fill_with='*'):
    """ 将指定范围内的字符替换成指定字符，范围规则与 list 切片一致 """
    sl = list(s)
    if end is None:
        end = len(sl)
    sl[start:end] = fill_with * len(sl[start:end])
    return ''.join(sl)


def env_detect():
    env = os.environ.get('APP_ENV')
    if env is None:
        env = 'DEV'
    return env


def request_ip():
    return (request.environ.get('HTTP_X_FORWARDED_FOR') or
            request.environ.get('REMOTE_ADDR'))


def request_ua():
    ua = request.headers.get('User-Agent', '')
    result = {
        'os': '',
        'os_version': '',
        'phone': '',
        'phone_model': '',
        'app': '',
        'app_version': '',
        'device_no': '',
    }
    items = ua.split(';')
    if len(items) < 4:
        return result
    result['os'], result['os_version'] = (items[0] + '/').split('/')[:2]
    result['phone'], result['phone_model'] = (items[1] + '/').split('/')[:2]
    result['app'], result['app_version'] = (items[2] + '/').split('/')[:2]
    _, result['device_no'] = (items[3] + '/').split('/')[:2]
    return result


class ChoiceEnum(Enum):
    @classmethod
    def choices(cls):
        return [(e.name, e.value) for e in cls]

    @classmethod
    def values(cls):
        return [e.value for e in cls]


def dt_truncate(dt):
    return dt.replace(hour=0, minute=0, second=0, microsecond=0)


def dt_ceiling(dt):
    return dt.replace(hour=23, minute=59, second=59, microsecond=0)


def get_text_from_tag(html_src):
    soup = BeautifulSoup(html_src)
    all_text = ''.join(soup.findAll(text=True))
    return all_text


number_strip_re = re.compile(r'\d+')

template = functools.partial(jinja2_view, template_lookup=['../website/templates'])
