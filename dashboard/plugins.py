from bottle import request


def boilerplate_plugin(callback):
    def wrapper(*args, **kwargs):
        body = callback(*args, **kwargs)
        return {
            'data': body,
        }
    return wrapper


def page_plugin(callback):
    default_page = 1
    default_page_size = 20

    def wrapper(*args, **kwargs):
        query, serializer = callback(*args, **kwargs)
        page = default_page
        page_size = default_page_size

        if request.query.page.isdigit():
            page = int(request.query.page)
        if request.query.page_size.isdigit():
            page_size = int(request.query.page_size)

        result = query.paginate(page, page_size)
        result = serializer.dump(result, many=True).data

        if len(result) < page_size:
            total_count = len(result)
        else:
            # todo caching
            total_count = query.count()

        return {
            'page': page,
            'page_size': page_size,
            'total_count': total_count,
            'total_page': ((total_count or 1) - 1)//page_size + 1,
            'result': result,
        }

    return wrapper
