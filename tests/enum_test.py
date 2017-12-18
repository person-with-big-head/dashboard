from enum import Enum

from peewee import basestring


class TestEnum(Enum):
    A = 1


class Test:
    def __init__(self, enum):
        self.enum = enum

    def run(self, value):
        # if isinstance(value, Enum):
        if isinstance(value, self.enum):
            return value.value

print(type(TestEnum.A))
print(isinstance(TestEnum.A, basestring))
print(TestEnum.A.value)
print(isinstance(TestEnum.A.value, Enum))

print(TestEnum.A)

print(Test(TestEnum).run(TestEnum.A))
