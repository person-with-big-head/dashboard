$(".add_cover").click(function () {
    $(".container-fluid").html(
        '<ol class="breadcrumb">' +
        '<li class="breadcrumb-item">' +
            '<a href="#">首页</a>' +
        '</li>'+
        '<li class="breadcrumb-item active">封面管理</li>' +
        '<li class="breadcrumb-item active">新增封面</li>' +
        '</ol>' +
        '<div class="row">' +
            '<div class="col-md-12">' +
                '<input type="file" multiple id="ssi-upload"/>' +
                '<div class="upload-cover-title">当前仅支持同时最多上传五张封面</div>' +
            '</div>' +
        '</div>'
    );

    $('#ssi-upload').ssi_uploader({
        url:'/v1/covers',
        maxFileSize: 5,
        allowed: ['jpg','gif','jpeg','png', 'bmp'],
    });
});
