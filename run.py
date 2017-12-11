from bottle import run
from dashboard.app import init_app


app = init_app()


if __name__ == '__main__':
    run(app, debug=True, reloader=True, port=1110)
