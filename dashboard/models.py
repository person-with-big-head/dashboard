import hashlib
from enum import Enum

import bcrypt
import bottle
import inspect

from datetime import datetime, timedelta
import jwt
from peewee import (DateTimeField, R, Model, DoesNotExist, BigIntegerField, BooleanField,
                    CharField, TextField, IntegerField, ForeignKeyField, SmallIntegerField)

from dashboard.db import db
from dashboard.utils import idg, request_ip, short_uuid

app = bottle.default_app()


def get_ordered_models(module):
    """ 按代码出现的先后顺序获取某一 module 中所有的 peewee.Model 子类 """
    def is_model(m):
        return isinstance(m, type) and issubclass(m, Model) and m != Model

    members = inspect.getmembers(module, is_model)
    # 按代码中的先后顺序排序
    members.sort(key=lambda x: inspect.getsourcelines(x[1])[1])
    return [model for _, model in members]


class ModelBase(Model):
    created_at = DateTimeField(constraints=[R('DEFAULT CURRENT_TIMESTAMP')])
    updated_at = DateTimeField(constraints=[R('DEFAULT CURRENT_TIMESTAMP'),
                                            R('ON UPDATE CURRENT_TIMESTAMP')])

    class Meta:
        database = db
        only_save_dirty = True

    @classmethod
    def get_or_none(cls, *query, **kwargs):
        """
        :rtype: ModelBase
        """
        try:
            return cls.get(*query, **kwargs)
        except DoesNotExist:
            return None

    def update_dict(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        return self


class EnumField(IntegerField):
    """Custom field to support enums"""

    def __init__(self, enum, **kwargs):
        super(EnumField, self).__init__(**kwargs)
        self.enum = enum

    def db_value(self, value):
        if isinstance(value, self.enum):
            return value.value  # convert str to int
        return None

    def python_value(self, value):
        if isinstance(value, int):
            return self.enum(value).name  # convert int to str
        return None

    def clone_base(self, **kwargs):
        return super(EnumField, self).clone_base(enum=self.enum, **kwargs)


class PostTypeEnum(Enum):
    ORIGINAL_POST = 1
    REPRINT_POST = 2


class ShowStatusEnum(Enum):
    SECRET_POST = 0
    PUBLIC_POST = 1


class PostStatusEnum(Enum):
    UNFINISHED_POST = 1
    FINISHED_POST = 2


class JudgeStatusEnum(Enum):
    NOT_JUDGE = 0
    JUDGE_PASS = 1
    JUDGE_DENY = 2


class Authors(ModelBase):
    author_id = CharField(max_length=16, default=short_uuid(), primary_key=True)
    author_name = CharField(max_length=64)
    hashed_password = CharField(max_length=64)
    author_avatar = CharField(max_length=128)
    author_description = TextField()
    author_email = CharField(max_length=255)
    is_active = BooleanField(default=False)

    def login(self, expire_days=3):
        expire_at = datetime.now() + timedelta(days=expire_days)
        session = Session.create(
            author=self,
            ip=request_ip(),
            expire_at=expire_at)

        UserLoginLog.create(
            author=self,
            ip=request_ip())

        return session, expire_at

    def is_valid(self):
        return self.is_active

    def set_password(self, password):
        if isinstance(password, str):
            password = bytes(password, 'utf-8')
        self.hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    def check_password(self, password):
        if not self.hashed_password:
            return False

        password = password.lower()
        if isinstance(password, str):
            password = bytes(password, 'utf-8')

        user_password = bytes(self.hashed_password, 'utf-8')
        is_valid = bcrypt.checkpw(password, user_password)
        if not is_valid and len(self.hashed_password) == 32:
            # 检查是不是 MD5 哈希保存的密码
            is_valid = hashlib.md5(password).hexdigest() == self.hashed_password
            if is_valid:
                # 如果是，转换成 bcrypt 哈希保存
                self.hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
                self.save()
        return is_valid

    class Meta:
        db_table = 'authors'


class Categories(ModelBase):
    category_id = CharField(max_length=16, default=short_uuid(),
                            primary_key=True, verbose_name='category_id')
    category_name = CharField(max_length=64)
    category_description = TextField()

    class Meta:
        db_table = 'categories'


class Covers(ModelBase):
    cover_id = CharField(max_length=16, default=short_uuid(), primary_key=True)
    cover_path = CharField(max_length=128)
    cover_name = CharField(max_length=64)

    class Meta:
        db_table = 'covers'


class BasketArticleList(ModelBase):
    post_id = CharField(max_length=16, default=short_uuid(),
                        primary_key=True, verbose_name='post_id')
    post_status = SmallIntegerField(default=PostStatusEnum.UNFINISHED_POST.value,
                                    choices=PostStatusEnum)
    post_type = SmallIntegerField(default=PostTypeEnum.ORIGINAL_POST.value,
                                  choices=PostTypeEnum)
    judge_status = SmallIntegerField(default=JudgeStatusEnum.NOT_JUDGE.value,
                                     choices=JudgeStatusEnum)
    show_status = SmallIntegerField(default=ShowStatusEnum.SECRET_POST.value,
                                    choices=ShowStatusEnum)
    is_top = BooleanField(default=0)
    post_like_count = IntegerField(default=0)
    post_comment_count = IntegerField(default=0)
    author = ForeignKeyField(Authors)
    category = ForeignKeyField(Categories)
    cover = ForeignKeyField(Covers)
    article_title = CharField(max_length=512, verbose_name='article_title')
    article_summary = TextField()

    class Meta:
        db_table = 'basket_articles_list'


class PoolArticle(ModelBase):
    post_id = CharField(max_length=16, default=short_uuid(), primary_key=True)
    post_status = SmallIntegerField(default=PostStatusEnum.UNFINISHED_POST.value,
                                    choices=PostStatusEnum)
    post_type = SmallIntegerField(default=PostTypeEnum.ORIGINAL_POST.value,
                                  choices=PostTypeEnum)
    post_like_count = IntegerField(default=0)
    post_comment_count = IntegerField(default=0)
    author = ForeignKeyField(Authors)
    category = ForeignKeyField(Categories)
    cover = ForeignKeyField(Covers)
    article_title = CharField(max_length=512)
    article_content = TextField()

    class Meta:
        db_table = 'pool_articles'


class Tags(ModelBase):
    tag_id = CharField(max_length=16, default=short_uuid(), primary_key=True)
    tag_name = CharField(max_length=64)
    tag_description = CharField(max_length=128)

    class Meta:
        db_table = 'tags'


class TagsArticles(ModelBase):
    id = BigIntegerField(default=idg, primary_key=True)
    tag_id = CharField(max_length=16)
    post_id = CharField(max_length=16)

    class Meta:
        db_table = 'tags_articles'


class Config(ModelBase):
    id = BigIntegerField()
    key = CharField(max_length=64)
    value = TextField()

    @classmethod
    def prefetch(cls, *items):
        configs = cls.filter(cls.key << [i for i in items])
        result = {}
        for c in configs:
            result[c.key] = c.value
        return result

    class Meta:
        db_table = 'site_cfg'


class APIUser(ModelBase):
    id = BigIntegerField(default=idg, primary_key=True)
    name = CharField(max_length=64)
    token = CharField(max_length=64)

    expire_at = DateTimeField(null=True)

    class Meta:
        db_table = 'api_user'


class Session(ModelBase):
    id = BigIntegerField(default=idg, primary_key=True)
    author = ForeignKeyField(Authors, 'sessions')
    ip = CharField(max_length=64)
    expire_at = DateTimeField()

    class Meta:
        db_table = 'session'

    def jwt_token(self):
        token = jwt.encode({
            'session_id': str(self.id),
            'user_id': str(self.author.id),
        }, app.config['user.jwt_key'])
        return token.decode('utf-8')


class UserLoginLog(ModelBase):
    id = BigIntegerField(default=idg, primary_key=True)
    user = ForeignKeyField(Authors, 'login_logs')
    ip = CharField(max_length=64)

    class Meta:
        db_table = 'user_login_log'


class CaptchaCode(ModelBase):
    id = BigIntegerField(default=idg, primary_key=True)
    cookie = CharField(max_length=128, null=True)
    key = CharField(max_length=16)
    expire_at = DateTimeField()

    class Meta:
        db_table = 'captcha_code'

    @staticmethod
    def create_cookie(cid, key, passport):
        token = jwt.encode({
            'captcha_id': cid,
            'key': key,
            'passport': passport
        }, app.config['user.jwt_key'])
        return token.decode('utf-8')

    @classmethod
    def check_captcha(cls, token, passport_, key_):
        try:
            payload = jwt.decode(token, app.config['user.jwt_key'])
            passport = payload['passport']
            if passport != passport_:
                return False
            key = payload['key']
            if key.lower() != key_:
                return False
            if not cls.get_or_none(cls.id == payload['captcha_id']):
                return False

        except jwt.DecodeError:
            return False

        return True
