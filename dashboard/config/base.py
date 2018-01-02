config = {
    'db': {
        'database': 'tangobello_db',
        'host': '139.224.105.129',
        'port': 3306,
        'user': 'root',
        'password': '1234',
        'charset': 'utf8mb4',
    },
    'user': {
        'jwt_key': 'testkey',
    },
    'es': {
        'host': '139.224.105.129',
    },
    'upload': {
        'directory': '../website/static/uploads',
        'url': 'http://dashboard.tangobello.cn/static/uploads'
    },
    'root': {
        'url': 'http://dashboard.tangobello.cn',
        'domain': 'tangobello.cn'
    }
}
