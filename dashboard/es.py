import bottle

from elasticsearch import ConnectionPool
from elasticsearch import Elasticsearch


class ESConnectionPool:
    def init(self, host):
        self._conn = Elasticsearch(host)

    def get_connection(self):
        return ConnectionPool(self._conn).get_connection()


es = ESConnectionPool()


def init():
    app = bottle.default_app()
    es.init(host=app.config['es.host'])
