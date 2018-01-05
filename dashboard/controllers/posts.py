import json
from datetime import datetime
from bottle import get, post, default_app
from elasticsearch import Elasticsearch

from dashboard.auth import get_user_or_401
from dashboard.models import (BasketArticleList, PoolArticle, PostTypeEnum,
                              PostStatusEnum, ShowStatusEnum, JudgeStatusEnum)
from dashboard.db import db
from dashboard.serializers import basket_article_list_serializer
from dashboard.plugins import page_plugin
from dashboard.utils import plain_forms, short_uuid, get_text_from_tag
from dashboard.validators import create_post_validator, delete_post_validator, update_post_validator


@get('/v1/posts', apply=[page_plugin])
def get_posts():
    user = get_user_or_401()
    posts = BasketArticleList.filter(BasketArticleList.author == user.author_id)
    return posts, basket_article_list_serializer


@get('/v1/post/<post_id>')
def get_post(post_id):
    user = get_user_or_401()
    article = (PoolArticle.select(PoolArticle, BasketArticleList.show_status)
               .join(BasketArticleList, on=(PoolArticle.post_id == BasketArticleList.post_id))
               .where(BasketArticleList.post_id == post_id, BasketArticleList.author == user.author_id))
    if not article:
        return

    article[0].show_status = article[0].post_id.show_status
    article[0].post_id = article[0].post_id.post_id

    return basket_article_list_serializer.dump(article[0]).data


@get('/v1/post/<post_id>/public')
def public_post(post_id):
    user = get_user_or_401()
    article = BasketArticleList.get(BasketArticleList.post_id == post_id,
                                    BasketArticleList.author == user.author_id)
    if article.show_status == ShowStatusEnum.PUBLIC_POST.value:
        return

    with db.atomic():
        article.show_status = ShowStatusEnum.PUBLIC_POST.value
        article.save()

    return


@get('/v1/post/<post_id>/hide')
def hide_post(post_id):
    user = get_user_or_401()
    article = BasketArticleList.get(BasketArticleList.post_id == post_id,
                                    BasketArticleList.author == user.author_id)

    if article.show_status == ShowStatusEnum.SECRET_POST.value:
        return

    with db.atomic():
        article.show_status = ShowStatusEnum.SECRET_POST.value
        article.save()

    return


@post('/v1/posts/batch_delete')
def delete_post():
    user = get_user_or_401()

    args = delete_post_validator(plain_forms())
    post_id_list = args['post_id_list']
    post_id_list = json.loads(post_id_list)

    i = 0
    while i < len(post_id_list):
        if not post_id_list[i]:
            del post_id_list[i]
            i += 1
            continue

        item = BasketArticleList.get_or_none(BasketArticleList.post_id == post_id_list[i],
                                             BasketArticleList.author == user.author_id)
        if not item:
            del post_id_list[i]

        i += 1

    BasketArticleList.delete().where(BasketArticleList.post_id << post_id_list).execute()
    PoolArticle.delete().where(PoolArticle.post_id << post_id_list).execute()

    app = default_app()
    es_ = Elasticsearch(app.config['es.host'])
    for item in post_id_list:
        es_.delete(index='pool_articles', doc_type='info', id=item)


@post('/v1/post/<post_id>')
def update_post(post_id):
    author = get_user_or_401()
    args = update_post_validator(plain_forms())

    # compute article summary.
    article_summary = get_text_from_tag(args['article_content'])

    body = {
        'post_status': args.get('post_status') or PostStatusEnum.UNFINISHED_POST.value,
        'post_type': args.get('post_type') or PostTypeEnum.ORIGINAL_POST.value,
        'show_status': args.get('show_status') or ShowStatusEnum.SECRET_POST.value,
        'is_top': args.get('is_top') or False,
        'judge_status': args.get('judge_status') or JudgeStatusEnum.NOT_JUDGE.value,
        'author': author.author_id,
        'category': args['category'],
        'article_title': args['article_title'],
        'article_summary': article_summary,
        'cover': args['cover'],
    }

    with db.atomic():

        BasketArticleList.update(body).where(BasketArticleList.post_id == post_id)

        del body['article_summary']
        body['article_content'] = args['article_content']
        body['article_content_md'] = args['article_content_md']

        PoolArticle.update(body).where(PoolArticle.post_id == post_id)

    app = default_app()
    es_ = Elasticsearch(app.config['es.host'])

    body = {
        'article_cover': args['cover'],
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


@post('/v1/posts')
def create_post():
    author = get_user_or_401()
    args = create_post_validator(plain_forms())

    # compute article summary.
    article_summary = get_text_from_tag(args['article_content'])

    post_id = short_uuid()

    body = {
        'post_id': post_id,
        'post_status': args.get('post_status') or PostStatusEnum.UNFINISHED_POST.value,
        'post_type': args.get('post_type') or PostTypeEnum.ORIGINAL_POST.value,
        'show_status': args.get('show_status') or ShowStatusEnum.SECRET_POST.value,
        'is_top': args.get('is_top') or False,
        'judge_status': args.get('judge_status') or JudgeStatusEnum.NOT_JUDGE.value,
        'author': author.author_id,
        'category': args['category'],
        'article_title': args['article_title'],
        'article_summary': article_summary,
        'cover': args['cover'],
    }

    with db.atomic():

        BasketArticleList.create(**body)

        del body['article_summary']
        body['article_content'] = args['article_content']
        body['article_content_md'] = args['article_content_md']

        PoolArticle.create(**body)

    app = default_app()
    es_ = Elasticsearch(app.config['es.host'])

    body = {
        'article_cover': args['cover'],
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
