from collections import defaultdict
from voluptuous import Schema, REMOVE_EXTRA, Length, All, Optional, Coerce


def Lower():
    return lambda v: v.lower()


class ValidatorSchema(Schema):
    def update(self, schema, required=None, extra=None):
        """ 类似 extend，但是会覆盖掉 repr 相同的 key """
        assert type(self.schema) == dict and type(schema) == dict

        result = self.schema.copy()

        result_key_map = defaultdict(list)
        for rk in result:
            result_key_map[str(rk)].append(rk)
        for sk in schema:
            for rk in result_key_map[str(sk)]:
                result.pop(rk)

        result.update(schema)

        result_required = (required if required is not None else self.required)
        result_extra = (extra if extra is not None else self.extra)
        return Schema(result, required=result_required, extra=result_extra)

    def replace_keys(self, *keys):
        assert type(self.schema) == dict, 'Schemas must be dictionary-based'

        result = self.schema.copy()

        result_key_map = defaultdict(list)
        for rk in result:
            result_key_map[str(rk)].append(rk)
        for sk in keys:
            for rk in result_key_map[str(sk)]:
                result[sk] = result.pop(rk)

        return Schema(result, required=self.required, extra=self.extra)


login_validator = ValidatorSchema({
    'username': Length(min=3, max=64),
    'password': All(Length(min=6), Lower())
}, required=True, extra=REMOVE_EXTRA)

create_post_validator = ValidatorSchema({
    'category': Length(min=1),
    'article_title': Length(min=1),
    'article_content': Length(min=1),
    'article_cover': Length(min=1),
    Optional('post_status'): Length(min=1),
    Optional('post_type'): Length(min=1),
    Optional('is_top'): Coerce(int),
}, required=True, extra=REMOVE_EXTRA)
