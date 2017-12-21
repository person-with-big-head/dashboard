import random
import calendar
import base64
import hmac
import hashlib
import logging


def refresh_cdn():
    action = 'RefreshCdnDir'
    secret_key = 'vb2D9qIVUEi180h9MK6dw3waz93iCVaQ'

    data = {
        'Action': action,
        'SecretId': 'AKIDAE3e064kDTXNyKMIvJSM1RcXEgsol3KM',
        'Timestamp': calendar.timegm(time.gmtime()),
        'Nonce': random.Random().randint(100000000, 999999999),
        'dirs.0': "http://news.7654.com/api/mini",
    }

    base_str = "POSTcdn.api.qcloud.com/v2/index.php?"
    for k in sorted(data.keys()):
        base_str += k + "=" + str(data[k]) + "&"

    base_str = base_str[0:-1]

    signature = base64.b64encode(hmac.new(bytes(secret_key, encoding='utf-8'),
                                 base_str.encode('utf-8'),
                                 hashlib.sha1).digest())

    data['Signature'] = signature

    logging.getLogger().info("start to refresh cdn")
    resp = requests.post('https://cdn.api.qcloud.com/v2/index.php',
                         data=data)
    logging.getLogger().info("refresh result is %s " % json.loads(resp.text))

refresh_cdn()
