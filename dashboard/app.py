import os
from importlib import import_module

import bottle
import logging


from dashboard import db
from dashboard.plugins import boilerplate_plugin
from dashboard.utils import env_detect
from dashboard.error import register_error_handler

os.chdir(os.path.dirname(__file__))
app = application = bottle.default_app()


def load_config():
    config = bottle.load('dashboard.config.base:config')
    app.config.load_dict(config)

    cur_env = env_detect().lower()

    if os.path.exists('config/%s.py' % cur_env):
        config = bottle.load('dashboard.config.%s:config' % cur_env)
        app.config.load_dict(config)


def load_controllers():
    for path in ['dashboard.controllers']:
        root_module = import_module(path)
        file_name = os.path.basename(root_module.__file__)
        if file_name != '__init__.py':
            continue

        root_dir = os.path.dirname(root_module.__file__)
        for c in os.listdir(root_dir):
            head, _ = os.path.splitext(c)
            if not head.startswith('_'):
                import_module(path + '.' + head)


def set_logger():
    default_format = ('[%(asctime)s] [%(levelname)s] '
                      '[%(module)s: %(lineno)d] %(message)s')
    logging.basicConfig(format=default_format,
                        level=logging.INFO,
                        datefmt='%Y-%m-%d %H:%M:%S %z')


def install_plugins():
    app.install(boilerplate_plugin)


def base_config():
    set_logger()

    load_config()
    db.init()


def init_app():
    base_config()

    load_controllers()
    install_plugins()

    register_error_handler()

    return app
