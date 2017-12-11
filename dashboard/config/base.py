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
    'service': {
        'repayment': {
            'token': '__placeholder__',
            'base_url': '__placeholder__',
        }
    },
    'gcp': {
        'storage': {
            'bucket_name': 'danacepat-aws-staging',
        }
    },
    'aws': {
        'rekognition': {
            'collection_id': '__placeholder__',
            'region_name': '__placeholder__',
        },
        'sns': {
            'arn_bus': '__placeholder__',
        }
    },
    'facebook': {
        'app_id': '__placeholder__',
        'app_secret': '__placeholder__',
        'account_kit': {
            'app_secret': '__placeholder__',
        }
    },
}