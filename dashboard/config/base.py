config = {
    'db': {
        'database': 'tangobello_db',
        'host': '127.0.0.1',
        'port': 3306,
        'user': 'root',
        'password': '1234',
        'charset': 'utf8mb4',
    },
    'user': {
        'jwt_key': 'testkey',
    },
    'es': {
        'host': '127.0.0.1',
    },
    'upload': {
        'directory': '../website/static/uploads',
        'url': 'http://blog.tangobello.cn/static/uploads'
    },
    'root': {
        'url': 'http://blog.tangobello.cn',
        'domain': 'tangobello.cn'
    }
}
