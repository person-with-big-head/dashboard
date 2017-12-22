from bottle import get, post

from dashboard.plugins import boilerplate_plugin
from dashboard.serializers import categories_serializer
from dashboard.models import Categories
from dashboard.auth import get_user_or_401


@get('/v1/categories')
def get_categories():
    # get_user_or_401()
    categories = Categories.select()
    return categories_serializer.dump(categories, many=True).data


@post('/v1/categories/', skip=[boilerplate_plugin])
def create_categories():
    get_user_or_401()

