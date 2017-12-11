import hashlib
from enum import Enum

import bcrypt
import bottle
import inspect

from datetime import datetime, timedelta
import jwt
from peewee import (DateTimeField, R, Model, DoesNotExist, BigIntegerField, BooleanField,
                    CharField, basestring, TextField, IntegerField, ForeignKeyField)

from dashboard.db import db
from dashboard.utils import idg, request_ip

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


class EnumField(CharField):
    """Custom field to support enums"""

    def __init__(self, enum, **kwargs):
        super(EnumField, self).__init__(**kwargs)
        self.enum = enum

    def db_value(self, value):
        if isinstance(value, Enum):
            return str(value.name)  # convert enum to str
        elif isinstance(value, basestring):
            return value
        return None

    def python_value(self, value):
        if value:
            return self.enum[value]  # convert str to enum
        return None

    def clone_base(self, **kwargs):
        return super(EnumField, self).clone_base(enum=self.enum, **kwargs)


class Authors(ModelBase):
    author_id = BigIntegerField(primary_key=True)
    author_name = CharField(max_length=255)
    author_avatar = TextField()
    author_description = TextField()

    class Meta:
        db_table = 'authors'


class Categories(ModelBase):
    category_id = BigIntegerField(primary_key=True)
    category_name = CharField(max_length=255)
    category_description = TextField()

    class Meta:
        db_table = 'categories'


class BasketArticleList(ModelBase):
    post_id = BigIntegerField(primary_key=True)
    post_date = DateTimeField()
    post_status = CharField(max_length=20)
    post_type = CharField(max_length=10)
    is_top = BooleanField(default=0)
    post_like_count = IntegerField(default=0)
    post_comment_count = IntegerField(default=0)
    author = ForeignKeyField(Authors)
    category = ForeignKeyField(Categories)
    article_title = TextField()
    article_summary = TextField()
    article_cover = TextField()

    class Meta:
        db_table = 'basket_article_list'


class PoolArticle(ModelBase):
    post_id = BigIntegerField(primary_key=True)
    post_date = DateTimeField()
    post_status = CharField(max_length=20)
    post_type = CharField(max_length=10)
    post_like_count = IntegerField(default=0)
    post_comment_count = IntegerField(default=0)
    author = ForeignKeyField(Authors)
    category = ForeignKeyField(Categories)
    article_title = TextField()
    article_cover = TextField()
    article_content = TextField()

    class Meta:
        db_table = 'pool_article'


class Tags(ModelBase):
    tag_ID = BigIntegerField(primary_key=True)
    tag_name = CharField(max_length=255)
    tag_description = TextField()

    class Meta:
        db_table = 'tags'


class TagsArticles(ModelBase):
    ID = BigIntegerField(primary_key=True)
    tag_ID = BigIntegerField()
    post_ID = BigIntegerField()

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


class User(ModelBase):
    id = BigIntegerField(default=idg, primary_key=True)
    username = CharField(max_length=64)
    hashed_password = CharField(max_length=64)
    email = CharField(max_length=255)
    is_active = BooleanField(default=False)

    def login(self, expire_days=3):
        expire_at = datetime.now() + timedelta(days=expire_days)
        session = Session.create(
            user=self,
            ip=request_ip(),
            expire_at=expire_at)

        UserLoginLog.create(
            user=self,
            ip=request_ip())

        return session

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
        db_table = 'user'


class APIUser(ModelBase):
    id = BigIntegerField(default=idg, primary_key=True)
    name = CharField(max_length=64)
    token = CharField(max_length=64)

    expire_at = DateTimeField(null=True)

    class Meta:
        db_table = 'api_user'


class Session(ModelBase):
    id = BigIntegerField(default=idg, primary_key=True)
    user = ForeignKeyField(User, 'sessions')
    ip = CharField(max_length=64)
    expire_at = DateTimeField()

    class Meta:
        db_table = 'session'

    def jwt_token(self):
        token = jwt.encode({
            'session_id': str(self.id),
            'user_id': str(self.user.id),
        }, app.config['user.jwt_key'])
        return token.decode('utf-8')


class UserLoginLog(ModelBase):
    id = BigIntegerField(default=idg, primary_key=True)
    user = ForeignKeyField(User, 'login_logs')
    ip = CharField(max_length=64)

    class Meta:
        db_table = 'user_login_log'
