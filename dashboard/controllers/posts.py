from bottle import get, post

from dashboard.auth import get_user_or_401
from dashboard.models import BasketArticleList, PoolArticle
from dashboard.db import db
from dashboard.serializers import post_serializer
from dashboard.plugins import page_plugin
from dashboard.utils import plain_forms, short_uuid
from dashboard.validators import create_post_validator
from dashboard.es import es


@get('/dashboard/post/set_top/<post_id>')
def set_top(post_id):
    user = get_user_or_401()
    post_ = BasketArticleList.get(BasketArticleList.post_id == post_id
                                  and BasketArticleList.author == user.id)

    with db.atomic():
        post_.is_top = False
        post_.save()

    return {}


@get('/dashboard/post/unset_top/<post_id>')
def unset_top(post_id):
    user = get_user_or_401()
    post_ = BasketArticleList.get(BasketArticleList.post_id == post_id
                                  and BasketArticleList.author == user.id)

    with db.atomic():
        post_.is_top = True
        post_.save()

    return {}


@get('/dashboard/posts', apply=[page_plugin])
def posts():
    user = get_user_or_401()
    posts_ = BasketArticleList.filter(BasketArticleList.author == user.id)
    return posts_, post_serializer


@post('/dashboard/post')
def create_post():
    user = get_user_or_401()
    args = create_post_validator(plain_forms())

    post_id = short_uuid()

    body = {
        'post_id': post_id,
        'post_status': args.get('post_status') or '1',
        'post_type': args.get('post_type') or '1',
        'is_top': args.get('is_top') or False,
        'author': user.id,
        'category': args['category'],
        'article_title': args['article_title'],
        'article_summary': args['article_summary'],
        'article_cover': args['article_cover'],
    }

    with db.atomic():

        BasketArticleList.create(**body)

        del body['post_summary']
        body['article_content'] = args['article_content']

        PoolArticle.create(**body)

    es_ = es.get_connection()
    es_.index(index='pool_articles', doc_type='info', id=post_id, body=body)

    return {}
