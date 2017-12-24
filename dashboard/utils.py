import os
import random
import string
import uuid
from enum import Enum
from base64 import b64encode
from gzip import compress

import re
from urllib.parse import urlencode

import jwt
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from bottle import request, response

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


def gzipped():
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            rsp_data = func(*args, **kwargs)
            if 'gzip' in request.headers.get('Accept-Encoding', ''):
                response.headers['Content-Encoding'] = 'gzip'
                rsp_data = compress(rsp_data.encode('utf-8'))
            return rsp_data

        return wrapper

    return decorator


def etagged():
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwds):
            rsp_data = func(*args, **kwds)
            etag = '"%s"' % b64encode((hash(rsp_data.encode('utf-8')) + 2 ** 63)
                                      .to_bytes(8, byteorder='big')).decode()[:11]
            if etag == request.headers.get('If-None-Match', '').lstrip('W/'):
                response.status = 304
                return ''
            response.headers['ETag'] = etag
            return rsp_data

        return wrapper

    return decorator


def short_uuid():
    return str(uuid.uuid1())[0:8]


def url_add_params(url, params):
    if type(params) is not dict:
        raise (TypeError, "Params of url must be a dict.")

    return url + "?" + urlencode(params)


def draw_captcha(seed=string.ascii_letters + string.digits, size=(120, 30), img_type='GIF', mode='RGB',
                 bg_color=(255, 255, 255), font_size=18, font_type="Playball.ttf", length=4, draw_lines=True,
                 n_lines=(1, 2), draw_points=True, point_chance=2, fg_color=(0, 0, 255)):
    """
        generator capture images.

    :param seed: the source.
    :param size: the image size.
    :param img_type: the extension name.
    :param mode: the mode.
    :param bg_color: the background color.
    :param font_size: the font size.
    :param font_type: the font family.
    :param length: the character len.
    :param draw_lines: weather draw line.
    :param n_lines: lines number.
    :param draw_points: weather draw point.
    :param point_chance: point position.
    :param fg_color: the foreground color.
    :return: capture name.
    """

    width, height = size
    img = Image.new(mode, size, bg_color)
    draw = ImageDraw.Draw(img)
    font_type = "../website/static/fonts/" + font_type

    def get_chars():
        """生成给定长度的字符串，返回列表格式"""
        return random.sample(seed, length)

    def create_lines():
        """绘制干扰线"""
        line_num = random.randint(*n_lines)

        for i in range(line_num):
            begin = (random.randint(0, size[0]), random.randint(0, size[1]))
            end = (random.randint(0, size[0]), random.randint(0, size[1]))
            draw.line([begin, end], fill=(0, 0, 0))

    def create_points():
        """绘制干扰点"""
        chance = min(100, max(0, int(point_chance)))

        for w in range(width):
            for h in range(height):
                tmp = random.randint(0, 100)
                if tmp > 100 - chance:
                    draw.point((w, h), fill=(0, 0, 0))

    def create_strs():
        """绘制验证码字符"""
        c_chars = get_chars()
        strs_ = ' %s ' % ' '.join(c_chars)

        font = ImageFont.truetype(font_type, font_size)
        font_width, font_height = font.getsize(strs_)

        draw.text(((width - font_width) / 3, (height - font_height) / 3),
                  strs_, font=font, fill=fg_color)

        return ''.join(c_chars)

    if draw_lines:
        create_lines()
    if draw_points:
        create_points()
    strs_ = create_strs()

    # 图形扭曲参数
    params = [1 - float(random.randint(1, 2)) / 100, 0, 0, 0,
              1 - float(random.randint(1, 10)) / 100,
              float(random.randint(1, 2)) / 500, 0.001,
              float(random.randint(1, 2)) / 500]
    img = img.transform(size, Image.PERSPECTIVE, params)
    img = img.filter(ImageFilter.EDGE_ENHANCE_MORE)

    image_id = short_uuid()
    captcha = "../website/static/verify_code/" + image_id + ".gif"
    img.save(captcha, img_type)

    img_url = 'http://127.0.0.1/static/verify_code/' + image_id + ".gif"

    return captcha, strs_


number_strip_re = re.compile(r'\d+')
template = functools.partial(jinja2_view, template_lookup=['../website/templates'])
allowed_image_ext = [".png", ".jpeg", ".jpg", ".gif"]
