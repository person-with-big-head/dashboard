import bottle
from bottle import hook
from playhouse.pool import PooledMySQLDatabase


class BeginPooledMySQL(PooledMySQLDatabase):
    def begin(self):
        # db api 并没有自动加 begin 语句，所以在此要手动加上
        self.get_conn().begin()


# 此处 autocommit 仅表示 peewee 是否在每一句后面自动加一句 commit
db = BeginPooledMySQL(None, autocommit=False)


def init():
    app = bottle.default_app()

    app.config.setdefault('db.read_timeout', 20)
    app.config.setdefault('db.write_timeout', 20)
    db.init(
        app.config['db.database'],
        host=app.config['db.host'],
        user=app.config['db.user'],
        port=app.config['db.port'],
        charset=app.config['db.charset'],
        password=app.config['db.password'],
        autocommit=True,  # 连接mysql 时是否使用autocommit 模式
        read_timeout=app.config['db.read_timeout'],
        write_timeout=app.config['db.write_timeout'],
    )


@hook('after_request')
def _close_db():
    if not db.is_closed():
        db.close()
