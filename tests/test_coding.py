import requests

from lxml import etree


resp = requests.get('http://www.qiwen8.com/yeshimiwen/130186.html')
resp.encoding = 'gbk'

tree = etree.HTML(resp.text)
s = tree.xpath("//h1//text()")
print(s)
# print(s[2].decode("utf-8"))
s[2].decode('gbk').encode('utf-8')
