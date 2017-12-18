import json
import os
import datetime

from bottle import post, request, default_app

from dashboard.plugins import boilerplate_plugin
from dashboard.utils import allowed_image_ext, short_uuid


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


@post('/upload', skip=[boilerplate_plugin])
def upload():

    file = request.files.get('file')
    name, ext = os.path.splitext(file.filename)

    if ext.lower() not in allowed_image_ext:
        return json.dumps({'error': 'File extension not allowed.'})

    save_path, file_url = get_save_path(short_uuid(), ext)
    file.save(save_path)

    return json.dumps({"filename": file_url})
