import happybase


conn = happybase.Connection('120.132.60.101')
table = conn.table('dev_basket_news_list')

c_24 = 0
for k, v in table.scan(row_prefix=24):
    print(k)
    c_24 += 1

c_61 = 0
for k, v in table.scan(row_prefix=24):
    print(k)
    c_61 += 1

c_62 = 0
for k, v in table.scan(row_prefix=24):
    print(k)
    c_62 += 1

c_63 = 0
for k, v in table.scan(row_prefix=24):
    print(k)
    c_63 += 1

c_64 = 0
for k, v in table.scan(row_prefix=24):
    print(k)
    c_64 += 1

c_65 = 0
for k, v in table.scan(row_prefix=24):
    print(k)
    c_65 += 1

c_66 = 0
for k, v in table.scan(row_prefix=24):
    print(k)
    c_66 += 1

c_67 = 0
for k, v in table.scan(row_prefix=24):
    print(k)
    c_67 += 1

print("c_24: %d" % c_24)
print("c_24: %d" % c_61)
print("c_24: %d" % c_62)
print("c_24: %d" % c_63)
print("c_24: %d" % c_64)
print("c_24: %d" % c_65)
print("c_24: %d" % c_66)
print("c_24: %d" % c_67)
