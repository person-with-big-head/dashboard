import json

from marshmallow import Schema, fields
from marshmallow import ValidationError


class EnumField(fields.Field):
    default_error_messages = {
        'by_name': 'Invalid enum member {input}',
        'by_value': 'Invalid enum value {input}'
    }

    def __init__(self, enum, by_value=False, error='',  *args, **kwargs):
        self.enum = enum
        self.by_value = by_value
        self.error = error
        super(EnumField, self).__init__(*args, **kwargs)

    def _serialize(self, value, attr, obj):
        if value is None:
            return None
        elif self.by_value:
            return value.value
        else:
            return value.name

    def _deserialize(self, value, attr, data):
        if value is None:
            return None
        elif self.by_value:
            return self._deserialize_by_value(value, attr, data)
        else:
            return self._deserialize_by_name(value, attr, data)

    def _deserialize_by_value(self, value, attr, data):
        try:
            return self.enum(value)
        except ValueError:
            self.fail('by_value', input=value)

    def _deserialize_by_name(self, value, attr, data):
        try:
            return getattr(self.enum, value)
        except AttributeError:
            self.fail('by_name', input=value)

    def fail(self, key, **kwargs):
        """depercation of name/value fail inputs"""
        if 'name' in kwargs:
            kwargs['input'] = kwargs['name']
        elif 'value' in kwargs:
            kwargs['input'] = kwargs['value']

        if self.error:
            if self.by_value:
                kwargs['choices'] = ', '.join([str(mem.value) for mem in self.enum])
            else:
                kwargs['choices'] = ', '.join([mem.name for mem in self.enum])
            msg = self.error.format(**kwargs)
            raise ValidationError(msg)
        else:
            super(EnumField, self).fail(key, **kwargs)


class JsonField(fields.Field):
    def _serialize(self, value, attr, obj):
        return json.loads(value or '[]')


class DictJsonField(fields.Field):
    def _serialize(self, value, attr, obj):
        return json.loads(value) if value else None


class AuthorsSerializer(Schema):
    author_id = fields.Integer()
    author_name = fields.Str()
    author_avatar = fields.Str()
    author_description = fields.Str()


class CategoriesSerializer(Schema):
    category_id = fields.Integer()
    category_name = fields.Str()
    category_description = fields.Str()


class CoversSerializer(Schema):
    cover_id = fields.Str()
    cover_path = fields.Str()
    cover_name = fields.Str()


class BasketArticleListSerializer(Schema):
    post_id = fields.Str()
    post_status = fields.Integer()
    post_type = fields.Integer()
    judge_status = fields.Integer()
    show_status = fields.Integer()
    post_like_count = fields.Integer()
    post_comment_count = fields.Integer()
    author = fields.Nested(AuthorsSerializer)
    category = fields.Nested(CategoriesSerializer)
    cover = fields.Nested(CoversSerializer)
    article_title = fields.Str()
    article_summary = fields.Str()
    article_content = fields.Str()
    created_at = fields.DateTime(format='%Y-%m-%d')
    updated_at = fields.DateTime(format='%Y-%m-%d')


basket_article_list_serializer = BasketArticleListSerializer(strict=True)
categories_serializer = CategoriesSerializer(strict=True)
covers_serializer = CoversSerializer(strict=True)
