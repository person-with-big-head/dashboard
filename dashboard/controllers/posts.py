from datetime import datetime
from bottle import get, post, default_app
from elasticsearch import Elasticsearch

from dashboard.auth import get_user_or_401
from dashboard.models import (BasketArticleList, PoolArticle, Authors, PostTypeEnum,
                              PostStatusEnum)
from dashboard.db import db
from dashboard.serializers import basket_article_list_serializer
from dashboard.plugins import page_plugin
from dashboard.utils import plain_forms, short_uuid, get_text_from_tag
from dashboard.validators import create_post_validator


@get('/dashboard/post/set_top/<post_id>')
def set_top(post_id):
    get_user_or_401()
    post_ = BasketArticleList.get(BasketArticleList.post_id == post_id)

    with db.atomic():
        post_.is_top = False
        post_.save()

    return {}


@get('/dashboard/post/unset_top/<post_id>')
def unset_top(post_id):
    get_user_or_401()
    post_ = BasketArticleList.get(BasketArticleList.post_id == post_id)

    with db.atomic():
        post_.is_top = True
        post_.save()

    return {}


@get('/dashboard/posts/list', apply=[page_plugin])
def posts():
    # get_user_or_401()
    posts_ = BasketArticleList.select()
    return posts_, basket_article_list_serializer


@post('/dashboard/post')
def create_post():
    # user = get_user_or_401()
    args = create_post_validator(plain_forms())

    # compute article summary.
    article_summary = get_text_from_tag(args['article_content'])

    post_id = short_uuid()
    author = Authors.get(Authors.author_id == 1)

    body = {
        'post_id': post_id,
        'post_status': args.get('post_status') or PostStatusEnum.UNFINISHED_POST.value,
        'post_type': args.get('post_type') or PostTypeEnum.ORIGINAL_POST.value,
        'is_top': args.get('is_top') or False,
        'author': author.author_id,
        'category': args['category'],
        'article_title': args['article_title'],
        'article_summary': article_summary,
        'cover_id': args['cover_id'],
    }

    with db.atomic():

        BasketArticleList.create(**body)

        del body['article_summary']
        body['article_content'] = args['article_content']

        PoolArticle.create(**body)

    app = default_app()
    es_ = Elasticsearch(app.config['es.host'])

    body = {
        'article_cover': args['cover_id'],
        'article_summary': article_summary,
        'post_date': datetime.now(),
        'author_id': author.author_id,
        'author_name': author.author_name,
        'author_avatar': author.author_avatar,
        'post_comment_count': 0,
        'post_like_count': 0,
    }

    es_.index(index='pool_articles', doc_type='info', id=post_id, body=body)

    return {'post_id': post_id}
