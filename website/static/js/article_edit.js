function getCovers($page, callback) {
    // 获取分类信息
    // url: 请求地址

    var result = {};
    var $url = $root + '/v1/covers?page=' + $page;
    $.ajax({
        type: 'GET',
        url: $url,
        success: function ($response) {
            result['cover_list'] = $response.data.result;
            result['page'] = $response.data.page;
            result['total_page'] = $response.data.total_page;
            callback(result);
        }
    })
}

$(document).on('click', '.confirm-image-select', function () {
    $(".image_list").modal('hide');
    var $data_id = $(".dashboard-icon-checked").parent().attr("data-id");
    var $data_url = $(".dashboard-icon-checked").parent().attr("data-url");
    var $data_name = $(".dashboard-icon-checked").parent().attr("data-name");
    var $image_url = $(".image_url");
    $image_url.text('![' + $data_name + '](' + $data_url + ')');
    $image_url.attr("rel", $data_url);
    $image_url.attr("data-id", $data_id);
    $(".select_image_btn").children(".dashboard-btn").text("重新选择");
});

$(document).on('click', '.select_image_btn button', function () {
    var $select_image = "";
    $select_image += '<form class="dashboard-form select_image_form">';
    $select_image += '<blockquote class="dashboard-elem-quote news_search">';
    $select_image += '<div class="dashboard-inline" style="width: 80%;">';
    $select_image += '<div class="dashboard-form-mid dashboard-word-aux">选择一张美美的图片作为你文章的封面</div>';
    $select_image += '</div>';
    $select_image += '<div class="dashboard-inline">';
    $select_image += '<a class="dashboard-btn dashboard-btn-danger confirm-image-select" href="#">确定</a>';
    $select_image += '</div>';
    $select_image += '<div class="dashboard-inline">';
    $select_image += '<a class="dashboard-btn dashboard-btn-normal next-image-select" href="#" data-url="1">换一批</a>';
    $select_image += '</div>';
    $select_image += '</blockquote>';
    $select_image += '<ul id="Images" class="select_image_list">';

    $select_image += '</ul>';
    $select_image += '</form>';
    $(".select_image").html($select_image);

    getCovers(1, renderingSelectCovers);
});

$(document).on('click', '.next-image-select', function () {
    var $data_url = $(this).attr("data-url");
    var $page = parseInt($data_url) + 1;
    getCovers($page, renderingSelectCovers);
});


function renderingSelectCovers($data){
    // 渲染封面选择列表
    var $page = parseInt($data['page']);
    var $total_page = parseInt($data['total_page']);
    var $cover_list = $data['cover_list'];

    var $select_image_list = $(".select_image_list");
    var $next_image_select = $(".next-image-select");
    $select_image_list.empty();

    for (var $i = 0; $i < $cover_list.length; $i++){
        var $tag = "";
        $tag += '<li data-url="' + $cover_list[$i].cover_id + '">';
        $tag += '<img src="' + $cover_list[$i].cover_path + '">';
        $tag += '<div class="operate">';
        $tag += '<div class="check">';
        $tag += '<input type="checkbox" name="belle" title="' + $cover_list[$i].cover_name + '">';
        $tag += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary" ';
        $tag += 'data-url="' + $cover_list[$i].cover_path + '" data-name="' + $cover_list[$i].cover_name;
        $tag += ' "data-id="' + $cover_list[$i].cover_id + '">';
        $tag += '<span>' + $cover_list[$i].cover_name + '</span>';
        $tag += '<div class="dashboard-icon select_image_icon"></div>';
        $tag += '</div>';
        $tag += '</div>';
        $tag += '</div>';
        $tag += '</li>';
        $select_image_list.append($tag);
    }

    if ($page == $total_page){
        $next_image_select.attr("data-url", 0);
        $next_image_select.text("重新浏览");
    }else{
        $next_image_select.attr("data-url", $page);
        $next_image_select.text("换一批");
    }
}


function mdEditor(){
    return new SimpleMDE({
        element: document.getElementById("write_article"),
        spellChecker: true,
        autosave: {
            enabled: true,
            unique_id: "write_article"
        },
        toolbar: [{
            name: "heading",
            action: SimpleMDE.toggleHeadingSmaller,
            className: "fa fa-header",
            title: "Heading"
        },
        {
            name: "bold",
            action: SimpleMDE.toggleBold,
            className: "fa fa-bold",
            title: "Bold"
        },
        {
            name: "italic",
            action: SimpleMDE.toggleItalic,
            className: "fa fa-italic",
            title: "Italic"
        },
        {
            name: "strikethrough",
            action: SimpleMDE.toggleStrikethrough,
            className: "fa fa-strikethrough",
            title: "Strikethrough"
        },
        {
            name: "code",
            action: SimpleMDE.toggleCodeBlock,
            className: "fa fa-code",
            title: "Code"
        },
        {
            name: "quote",
            action: SimpleMDE.toggleBlockquote,
            className: "fa fa-quote-left",
            title: "Quote"
        },
        {
            name: "unordered-list",
            action: SimpleMDE.toggleUnorderedList,
            className: "fa fa-list-ul",
            title: "toggleUnorderedList"
        },
        {
            name: "ordered-list",
            action: SimpleMDE.toggleOrderedList,
            className: "fa fa-list-ol",
            title: "Numbered List"
        },
        {
            name: "link",
            action: SimpleMDE.drawLink,
            className: "fa fa-link",
            title: "Create Link"
        },
        {
            name: "clean-block",
            action: SimpleMDE.cleanBlock,
            className: "fa fa-eraser fa-clean-block",
            title: "Clean block"
        },
        {
            name: "table",
            action: SimpleMDE.drawTable,
            className: "fa fa-table",
            title: "Insert Table"
        },
        {
            name: "horizontal-rule",
            action: SimpleMDE.drawHorizontalRule,
            className: "fa fa-minus",
            title: "Insert Horizontal Line"
        },
        {
            name: "image",
            action: SimpleMDE.drawImage,
            className: "fa fa-picture-o",
            title: "Insert Image"
        },
        {
            name: "preview",
            action: function preview(editor) {
                SimpleMDE.togglePreview(editor);
                loadScript('/static/js/prism.js');
            },
            className: "fa fa-eye no-disable",
            title: "Toggle Preview"
        },
        {
            name: "side-by-side",
            action: function sideBySide(editor){
                SimpleMDE.toggleSideBySide(editor);
                loadScript('/static/js/prism.js');
            },
            // action: SimpleMDE.toggleSideBySide,
            className: "fa fa-columns no-disable no-mobile",
            title: "Toggle Side by Side"
        },
        {
            name: "fullscreen",
            action: function fullScreen(editor){
                SimpleMDE.toggleFullScreen(editor);
                loadScript('/static/js/prism.js');
            },
            // action: SimpleMDE.toggleFullScreen,
            className: "fa fa-arrows-alt no-disable no-mobile",
            title: "Toggle Fullscreen"
        },
        {
            name: "guide",
            action: "www.baidu.com",
            className: "fa fa-question-circle",
            title: "Markdown Guide"
        }]
    });
}


function get_article($post_id, callback) {
    // 获取分类信息
    // url: 请求地址

    var result = {};
    var $url = $root + '/v1/post/' + $post_id;
    $.ajax({
        type: 'GET',
        url: $url,
        success: function ($response) {
            result['post_id'] = $response.data.post_id;
            result['article_content'] = $response.data.article_content;
            result['article_content_md'] = $response.data.article_content_md;
            result['category_id'] = $response.data.category.category_id;
            result['cover_id'] = $response.data.cover.cover_id;
            result['cover_name'] = $response.data.cover.cover_name;
            result['cover_path'] = $response.data.cover.cover_path;
            result['show_status'] = $response.data.show_status;
            result['article_title'] = $response.data.article_title;
            callback(result);
        }
    })
}

$(document).on('click', '.article_edit', function () {

    get_article($(this).closest("tr").attr("data-id"), function ($result) {
        $(".container-fluid").html(
            '<ol class="breadcrumb">' +
            '<li class="breadcrumb-item">' +
                '<a href="#">首页</a>' +
            '</li>'+
            '<li class="breadcrumb-item active">文章管理</li>' +
            '<li class="breadcrumb-item active">写文章</li>' +
            '</ol>' +
            '<form class="dashboard-form">' +
                 '<div class="dashboard-form-item">' +
                 '<label class="dashboard-form-label">文章标题</label>' +
                 '<div class="dashboard-input-block">' +
                      '<input type="text" class="dashboard-input articleName" placeholder="请输入文章标题">' +
                 '</div>' +
                 '</div>' +
                 '<div class="dashboard-form-item">' +
                 '<div class="dashboard-inline">' +
                 '<label class="dashboard-form-label">自定义属性</label>' +
                 '<div class="dashboard-input-block">' +
                     '<input type="checkbox" name="public" title="公开">' +
                     '<div class="dashboard-unselect dashboard-form-checkbox edit_make_public" lay-skin="">' +
                        '<span>公开</span>' +
                     '</div>' +
                 '</div>' +
                 '</div>' +
                 '<div class="dashboard-inline">' +
                     '<label class="dashboard-form-label">类别</label>' +
                     '<div class="dashboard-input-inline">' +
                          '<select class="form-control select_category" style="display: block;">' +
                          '</select>' +
                    '</div>' +
                '</div>' +
                '</div>' +
                '<div class="dashboard-form-item">' +
                '<div class="dashboard-inline">' +
                '<label class="dashboard-form-label">封面</label>' +
                '<div class="dashboard-input-block">' +
                    '<a href="javascript:;" data-toggle="modal" data-target=".image_list" class="select_image_btn">' +
                        '<button class="dashboard-btn" style="background:#5FB878">点击选择</button>' +
                    '</a>' +
                '</div>' +
                '</div>' +
                '<div class="dashboard-inline">' +
                    '<div class="image_name">' +
                    '<a class="image_url show-cover" href="#" data-toggle="modal" data-target=".single-cover" ' +
                    'rel=""></a>' +
                    '</div>' +
                    /*image view modal*/
                    '<div class="modal fade single-cover" tabindex="-1" role="dialog"' +
                    'aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
                        '<div class="modal-dialog modal-lg">' +
                            '<div class="modal-content view-cover">' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '</div>' +
                '<div class="dashboard-form-item">' +
                    '<label class="dashboard-form-label">文章内容</label>' +
                    '<div class="dashboard-input-block">' +
                        '<textarea id="write_article" name="article_content"></textarea>' +
                    '</div>' +
                '</div>' +
                '<div class="dashboard-form-item">' +
                    '<div class="dashboard-input-block">' +
                        '<a class="dashboard-btn edit_release_article" href="#">发布</a>' +
                        '<a class="dashboard-btn dashboard-btn-primary edit_save_as_draft" href="#">存为草稿</a>' +
                    '</div>' +
                '</div>' +
            '</form>' +
            '<div class="modal fade image_list" tabindex="-1" role="dialog"' +
            'aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog modal-lg">' +
                '<div class="modal-content select_image">' +

                '</div>' +
            '</div>' +
            '</div>'
        );

        // 编辑器
        var md_editor = mdEditor();

        // 编辑器发生文本变化计算code语法。
        // md_editor.codemirror.on("change", function(){
        //     loadScript('/static/js/prism.js');
        // });

        // 编辑器支持图片的拖拽上传
        inlineAttachment.editors.codemirror4.attach(md_editor.codemirror, {
            uploadUrl: $root + '/v1/images',
            onFileUploadResponse: function(xhr) {
                var result = JSON.parse(xhr.responseText),
                filename = result[this.settings.jsonFieldName];

                if (result && filename) {
                    var newValue;
                    if (typeof this.settings.urlText === 'function') {
                        newValue = this.settings.urlText.call(this, filename, result);
                    } else {
                        newValue = this.settings.urlText.replace(this.filenameTag, filename);
                    }
                    var text = this.editor.getValue().replace(this.lastValue, newValue);
                    this.editor.setValue(text);
                    this.settings.onFileUploaded.call(this, filename);
                }else{

                }
                return false;
            }
        });

        md_editor.value($result.article_content_md);

        // 加载分类信息
        var $url = $root + '/v1/categories';
        getCategories($url, renderingSelectCategories, function () {
            $(".select_category").val($result.category_id);
        });

        var $image_url = $(".image_url");
        $image_url.text('![' + $result.cover_name + '](' + $result.cover_path + ')');
        $image_url.attr("rel", $result.cover_path);
        $image_url.attr("data-id", $result.cover_id);
        $(".select_image_btn").children(".dashboard-btn").text("重新选择");

        if (parseInt($result.show_status) == 1){
            $(".edit_make_public").addClass("make_public_checked");
        }else{
            $(".edit_make_public").removeClass("make_public_checked");
        }

        $(".articleName").val($result.article_title);

        alert(md_editor);

        // 发布文章
        $(document).on('click', '.edit_release_article', function () {
            // $(".edit_release_article").click(function (e) {return false;});

            alert(1);

            var $converter = new showdown.Converter();
            var $category = $(".select_category").val();
            var $article_title = $(".articleName").val();
            var $cover = $(".image_url").attr("data-id");
            alert(0);

            alert(md_editor);

            var $article_content = $converter.makeHtml(md_editor.value());
            var $article_content_md = md_editor.value();

            alert(2);

            var $show_status = $(".edit_make_public").hasClass("make_public_checked");
            var $is_top = $(".edit_make_top").hasClass("make_top_checked");

            // 是否公开
            if ($show_status){
                $show_status = 1;
            }else{
                $show_status = 0;
            }

            // 是否置顶
            if ($is_top){
                $is_top = 1;
            }else {
                $is_top = 0;
            }

            alert(3);

            if (!$category || !$article_title || !$article_content || !$cover){
                swal("提示", "请填写所有字段");
            }else{
                var $data = {
                    post_status: 2,
                    category: $category,
                    article_title: $article_title,
                    article_content: $article_content,
                    article_content_md: $article_content_md,
                    cover: $cover,
                    show_status: $show_status,
                    judge_status: 1,
                    is_top: $is_top
                };

                updateArticle($data, $result.post_id, function () {
                    $(".article_list").trigger("click");
                    md_editor = null;
                    swal("提示", "发布成功");
                });
            }
        });

        // 保存草稿
        $(document).on('click', '.edit_save_as_draft', function () {
            var $converter = new showdown.Converter();
            var $category = $(".select_category").val();
            var $article_title = $(".articleName").val();
            var $cover = $(".image_url").attr("data-id");
            var $article_content = $converter.makeHtml(md_editor.value());
            var $article_content_md = md_editor.value();

            var $show_status = $(".make_public").hasClass("make_public_checked");
            var $is_top = $(".make_top").hasClass("make_top_checked");

            // 是否公开
            if ($show_status){
                $show_status = 1;
            }else{
                $show_status = 0;
            }

            // 是否置顶
            if ($is_top){
                $is_top = 1;
            }else{
                $is_top = 0;
            }

            if (!$article_title || !$article_content){
                swal({title: "提示", text: "请填写所有字段", timer: 2000});
            }else{
                var $data = {
                    post_status: 1,
                    category: $category,
                    article_title: $article_title,
                    article_content: $article_content,
                    article_content_md: $article_content_md,
                    cover: $cover,
                    show_status: $show_status,
                    judge_status: 1,
                    is_top: $is_top
                };

                updateArticle($data, $result.post_id, function () {
                    $(".article_list").trigger("click");
                    md_editor = null;
                    swal({title: "提示", text: "请填写所有字段", timer: 2000});
                });
            }
        });

    });
});


function updateArticle($data, $post_id, callback){
    // 创建文章
    $.ajax({
        type: 'POST',
        url: $root + '/v1/post/' + $post_id,
        data: $data,
        success: function (data) {
            callback();
        }
    })
}

function getCategories($url, callback1, callback2){
    // 获取分类信息
    // url: 请求地址

    var result = {};
    $.ajax({
        type: 'GET',
        url: $url,
        success: function ($response) {
            result['select_list'] = $response.data;
            callback1(result);
            callback2();
        }
    })
}

function renderingSelectCategories($data){
    // 渲染类别选择框
    // url: 表单数据地址
    var $select_category = $(".select_category");
    var $select_list = $data['select_list'];
    for (var $i = 0; $i < $select_list.length; $i++){
        var $tag = '<option value="' + $select_list[$i].category_id + '">'
            + $select_list[$i].category_name + '</option>';
        $select_category.append($tag);
    }
}


$(document).on('click', '.edit_make_public', function() {
    $(this).toggleClass("make_public_checked");
});
