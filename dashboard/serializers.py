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


class PostsSerializer(Schema):
    post_id = fields.Integer()
    post_date = fields.DateTime()
    post_status = fields.Str()
    post_type = fields.Str()
    post_like_count = fields.Str()
    post_comment_count = fields.Str()
    author = fields.Nested(AuthorsSerializer)
    category = fields.Nested(CategoriesSerializer)
    article_title = fields.Str()
    article_summary = fields.Str()
    article_img_list = JsonField()
    article_content = fields.Str()


post_serializer = PostsSerializer(strict=True)

