import json
import os
import datetime

from bottle import post, get, request, default_app

from dashboard.plugins import boilerplate_plugin, page_plugin
from dashboard.utils import allowed_image_ext, short_uuid
from dashboard.serializers import covers_serializer
from dashboard.models import Covers
from dashboard.auth import get_user_or_401


def get_save_path(file, ext):
    app = default_app()
    directory = app.config['upload.directory']
    url = app.config['upload.url']

    t = datetime.datetime.now()
    year = str(t.year)
    month = str(t.month) if len(str(t.month)) == 2 else '0' + str(t.month)

    upload_directory = os.path.join(directory, year, month)

    if not os.path.exists(upload_directory):
        os.makedirs(upload_directory)

    file_url = (url + '/' + year + '/' + month + '/' + file + ext)

    return os.path.join(upload_directory, file + ext), file_url


@post('/v1/covers', skip=[boilerplate_plugin])
def create_covers():
    # get_user_or_401()

    file = request.files.get('file')
    name, ext = os.path.splitext(file.filename)

    if ext.lower() not in allowed_image_ext:
        return json.dumps({'error': 'File extension not allowed.'})

    cover_id = short_uuid()
    save_path, file_url = get_save_path(cover_id, ext)
    file.save(save_path)

    Covers.create(cover_id=cover_id, cover_path=file_url, cover_name=name)

    return json.dumps({"filename": file_url})


@get('/v1/covers', apply=[page_plugin])
def get_covers():
    # get_user_or_401()

    covers = Covers.select()
    return covers, covers_serializer
