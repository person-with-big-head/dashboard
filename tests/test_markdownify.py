import html2text
print(html2text.html2text("<pre><code>Hello, world.</code></pre>"))

import redis

r = redis.from_url('redis://:crs-ilgeirqo:@66#fko0@10.66.199.98:6379/1')
print(r)
