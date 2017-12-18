/**
 * Created by tiger on 2017/12/12.
 */


(function($) {
  "use strict"; // Start of use strict

    // view covers.
    $(".panel_images").click(function () {
        var $view_pages = "";
        $view_pages += '<form class="layui-form">';
        $view_pages += '<blockquote class="layui-elem-quote news_search">';
        $view_pages += '<div class="layui-inline"><input type="checkbox" name="selectAll" id="selectAll"';
        $view_pages += 'lay-filter="selectAll" lay-skin="primary" title="全选">';
        $view_pages += '<div class="layui-unselect layui-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>全选</span><i class="layui-icon"></i></div></div><div class="layui-inline">';
        $view_pages += '<a class="layui-btn layui-btn-danger batchDel" href="#">批量删除</a></div>';
        $view_pages += '</blockquote>';
        $view_pages += '<ul id="Images"><li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="layui-unselect layui-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><i class="layui-icon"></i></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<div class="layui-flow-more"><a href="javascript:;"><cite>加载更多</cite></a></div></ul></form>';

        $(".view_images").html($view_pages);

    });

    $(".article_list").click(function () {
       $(".container-fluid").html(
           '<ol class="breadcrumb">' +
           '<li class="breadcrumb-item">' +
                '<a href="#">首页</a>' +
           '</li>'+
           '<li class="breadcrumb-item active">文章管理</li>' +
           '<li class="breadcrumb-item active">文章列表</li>' +
           '</ol>' +

           '<blockquote class="layui-elem-quote news_search">'+
           '<div class="layui-inline">' +
                '<div class="layui-input-inline">' +
                    '<input type="text" value="" placeholder="请输入关键字" class="layui-input search_input">' +
                '</div>' +
                '<a class="layui-btn search_btn" href="#">查询</a>' +
           '</div>' +
           '<div class="layui-inline">' +
                '<a class="layui-btn layui-btn-normal newsAdd_btn" href="#">添加文章</a>' +
           '</div>' +
           '<div class="layui-inline">' +
                '<a class="layui-btn layui-btn-danger batchDel" href="#">批量删除</a>' +
           '</div>' +
           '<div class="layui-inline" style="font-size:13px; padding-top:8px; float:right;">' +
                '<label class="page-label">页</label>' +
           '</div>' +
           '<div class="layui-inline page-size">' +
                '<select name="page_size" aria-controls="dataTable" class="page_size">' +
                    '<option value="10">10</option>' +
                    '<option value="25">25</option>' +
                    '<option value="50">50</option>' +
                    '<option value="100">100</option>' +
                '</select>' +
           '</div>' +
           '<div class="layui-inline" style="font-size:13px; padding-top:8px; float:right;">' +
               '<label class="page-label">每页显示</label>' +
           '</div>' +
        '</blockquote>' +
        '<div class="layui-form news_list">' +
        '<table class="layui-table">' +
            '<colgroup>' +
               '<col width="50">' +
               '<col width="7%">' +
               '<col>' +
               '<col width="8%">' +
               '<col width="6%">' +
               '<col width="6%">' +
               '<col width="5%">' +
               '<col width="9%">' +
               '<col width="15%">' +
            '</colgroup>' +
            '<thead>' +
                '<tr>' +
                    '<th>' +
                        '<input type="checkbox" name="" lay-skin="primary" id="allChoose">' +
                        '<div class="layui-unselect layui-form-checkbox" lay-skin="primary">' +
                            '<div class="checkbox-icon chooseAll" title="反选">&nbsp;</div>' +
                        '</div>' +
                    '</th>' +
                    '<th>封面</th>' +
                    '<th class="sorting" data-url="article_title" style="text-align:left;">文章标题</th>' +
                    '<th class="sorting" data-url="author_name">发布人</th>' +
                    '<th class="sorting" data-url="">审核状态</th>' +
                    '<th class="sorting" data-url="">是否公开</th>' +
                    '<th class="sorting" data-url="">是否置顶</th>' +
                    // '<th class="sorting" data-url="">封面</th>' +
                    '<th class="sorting" data-url="">发布时间</th>' +
                    '<th>操作</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody class="news_content">' +
            '</tbody>' +
        '</table>' +
        '<div class="table-footer">' +
           'Showing 1 to <span class="page-total"></span> of <span class="data-total"></span> entries.' +
           '<div class="page_bar">' +
           '</div>' +
        '</div>' +
        '</div>');

        var $url = 'http://127.0.0.1:1110/dashboard/posts/list';
        getTableData($url, true, renderingArticleTable);
    });

    $(".add_article").click(function () {
        $(".container-fluid").html(
            '<ol class="breadcrumb">' +
            '<li class="breadcrumb-item">' +
                '<a href="#">首页</a>' +
            '</li>'+
            '<li class="breadcrumb-item active">文章管理</li>' +
            '<li class="breadcrumb-item active">写文章</li>' +
            '</ol>' +
            '<form class="layui-form">' +
                 '<div class="layui-form-item">' +
			     '<label class="layui-form-label">文章标题</label>' +
                 '<div class="layui-input-block">' +
				      '<input type="text" class="layui-input newsName" placeholder="请输入文章标题">' +
			     '</div>' +
		         '</div>' +
		         '<div class="layui-form-item">' +
                 '<div class="layui-inline">' +
                 '<label class="layui-form-label">自定义属性</label>' +
				 '<div class="layui-input-block">' +
                     '<input type="checkbox" name="recommend" class="make_top" title="推荐">' +
                     '<div class="layui-unselect layui-form-checkbox" lay-skin=""><span>推荐</span>' +
                        '<i class="fa fa-circle" aria-hidden="true"></i>' +
                     '</div>' +
                     '<input type="checkbox" name="public" class="make_public" title="公开">' +
                     '<div class="layui-unselect layui-form-checkbox" lay-skin=""><span>公开</span>' +
                        '<i class="fa fa-circle" aria-hidden="true"></i>' +
                     '</div>' +
                 '</div>' +
                 '</div>' +
                 '<div class="layui-inline">' +
                     '<label class="layui-form-label">类别</label>' +
                     '<div class="layui-input-inline">' +
                          '<select class="form-control" style="display: block;">' +
                              '<option>Large select</option>' +
                          '</select>' +
                    '</div>' +
                '</div>' +
                '<div class="layui-inline">' +
                     '<label class="layui-form-label">标签</label>' +
                     '<div class="layui-input-inline">' +
                          '<select class="form-control" style="display: block;">' +
                              '<option>Large select</option>' +
                          '</select>' +
                    '</div>' +
                '</div>' +
                '</div>' +
                '<div class="layui-form-item">' +
                '<label class="layui-form-label">封面</label>' +
                '<div class="layui-input-block">' +
                    '<button class="layui-btn" style="background:#5FB878">点击选择</button>' +
                '</div>' +
                '</div>' +
                '<div class="layui-form-item">' +
                    '<label class="layui-form-label">文章内容</label>' +
                    '<div class="layui-input-block">' +
                        '<textarea id="write_article" name="article_content"></textarea>' +
                    '</div>' +
                '</div>' +
                '<div class="layui-form-item">' +
                    '<div class="layui-input-block">' +
                        '<button class="layui-btn">发布</button>' +
                        '<button class="layui-btn layui-btn-primary save_as_draft">存为草稿</button>' +
                    '</div>' +
                '</div>' +
            '</form>');
        var md_editor = mdEditor();
        inlineAttachment.editors.codemirror4.attach(md_editor.codemirror, {
            uploadUrl: 'http://127.0.0.1:1110/upload',
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
                    method.msg_layer({title:"提示",content:"不支持的文件格式"});
                    method.msg_close()
                }
                return false;
            }
        });
    });

    $('.chooseAll').tooltip();

})(jQuery);


function getTableData($url, $pagination, callback) {
    // 获取表格数据
    // url: 请求地址，pagination: 是否有分页

    var result = {};

    $.ajax({
        type: 'GET',
        url: $url,
        success: function ($response) {
            if ($pagination){
                result['total_page'] = $response.data.total_page;
                result['total_count']= $response.data.total_count;
                result['page'] = $response.data.page;
                result['post_list'] = $response.data.result;
            }else{
                result['post_list'] = $response.data.result;
            }
            callback(result);
        }
    });
}

function renderingArticleTable($data) {
    // 渲染文章列表页面
    // url: 表单数据地址

    var $table_content = $("");
    var $post_list = $data['post_list'];
    for (var $i = 0; $i < $post_list.length; $i++){
        $table_content += '<tr>';
        $table_content += '<td>';
        $table_content += '<input type="checkbox" name="checked" lay-skin="primary" class="choose">';
        $table_content += '<div class="layui-unselect layui-form-checkbox" lay-skin="primary">';
        $table_content += '<div class="checkbox-icon">&nbsp;</div>';
        $table_content += '</div>';
        $table_content += '</td>';
        $table_content += '<td class="cover_name"><a href="javascript:;"';
        $table_content += 'data-toggle="modal" data-target=".single-cover"';
        $table_content += ' class="show-cover screenshot" rel="' + $post_list[$i].cover.cover_path;
        $table_content += '"title="'+ $post_list[$i].cover.cover_name +'">';
        $table_content += $post_list[$i].cover.cover_name + '</a>';

        /*image view modal*/
        $table_content += '<div class="modal fade single-cover" tabindex="-1" role="dialog"';
        $table_content += 'aria-labelledby="myLargeModalLabel" aria-hidden="true">';
        $table_content += '<div class="modal-dialog modal-lg">';
        $table_content += '<div class="modal-content view-cover">';
        $table_content += '</div>';
        $table_content += '</div>';
        $table_content += '</div></td>';

        $table_content += '<td align="left">' + $post_list[$i].article_title + '</td>';
        $table_content += '<td>' + $post_list[$i].author.author_name + '</td>';

        if ($post_list[$i].judge_status == 0){
            $table_content += '<td style="color:#f7b82c;">待审核</td>';
        }else if($post_list[$i].judge_status == 1){
            $table_content += '<td style="color:#7cc490;">审核通过</td>';
        }else{
            $table_content += '<td style="color:#f00">审核失败</td>';
        }

        if ($post_list[$i].show_status == 0){
            $table_content += '<td><input type="checkbox" name="show" lay-skin="switch" checked="">';
            $table_content += '<div class="layui-unselect layui-form-switch show_status">';
            $table_content += '<em>否</em><i></i></div></td>';
        }else{
            $table_content += '<td><input type="checkbox" name="show" lay-skin="switch" checked="">';
            $table_content += '<div class="layui-unselect layui-form-switch layui-form-onswitch show_status">';
            $table_content += '<em>是</em><i></i></div></td>';
        }

        if ($post_list[$i].is_top == 0){
            $table_content += '<td><input type="checkbox" name="show" lay-skin="switch" checked="">';
            $table_content += '<div class="layui-unselect layui-form-switch is_top">';
            $table_content += '<em>否</em><i></i></div></td>';
        }else{
            $table_content += '<td><input type="checkbox" name="show" lay-skin="switch" checked="">';
            $table_content += '<div class="layui-unselect layui-form-switch layui-form-onswitch is_top">';
            $table_content += '<em>是</em><i></i></div></td>';
        }

        $table_content += '<td>' + $post_list[$i].updated_at + '</td>';
        $table_content += '<td><a class="layui-btn layui-btn-mini news_edit">';
        $table_content += '<i class="fa fa-pencil-square-o" aria-hidden="true"></i> <span>编辑</span></a>';
        $table_content += '<a class="layui-btn layui-btn-mini news_collect" style="background-color: #1E9FFF">';
        $table_content += '<i class="fa fa-star-o" aria-hidden="true"></i> <span>收藏</span></a>';
        $table_content += '<a class="layui-btn layui-btn-mini news_judge" style="background-color: #FF5722;">';
        $table_content += '<i class="fa fa-eye" aria-hidden="true"></i> <span>审核</span></a></td>';
    }

    $(".news_content").html($table_content);
    $(".page-total").html($data['total_page']);
    $(".data-total").html($data['total_count']);

    renderingTablePagination($data['total_page'], $data['page']);
}


function renderingTablePagination($total_page, $page) {
    // 渲染表格分页页面
    // total_page: 页面总数，page: 当前页号

    var $page_bar = $();
    if ($total_page <= 7){
        $page_bar = '<nav aria-label="Page navigation example"><ul class="pagination">';
        for (var $i = 1; $i <= $total_page; $i++){
            $page_bar += '<li class="page-item"><a class="page-link page-article" href="#">' + $i + '</a></li>';
        }
        $page_bar += '</ul></nav>';
    }else if($page <= 4){
        $page_bar = '<nav aria-label="Page navigation example"><ul class="pagination">';
        for (var $j = 1; $j <= 6; $j++){
            $page_bar += '<li class="page-item"><a class="page-link page-article" href="#">' + $j + '</a></li>';
        }
        $page_bar += '<li class="page-item"><a style="border:none;">· · ·</a></li>';
        $page_bar += '<li class="page-item"><a class="page-link page-article" href="#">' + $total_page + '</a></li>';
        $page_bar += '</ul></nav>';
    }else if($page >= $total_page - 3){
        $page_bar = '<nav aria-label="Page navigation example"><ul class="pagination">';
        for (var $r = 1; $r <= 6 - ($total_page - $page); $r++){
            $page_bar += '<li class="page-item"><a class="page-link page-article" href="#">' + $r + '</a></li>';
        }
        $page_bar += '<li class="page-item"><a style="border:none;">· · ·</a></li>';
        for (var $p = $page; $p <= $total_page; $p++){
            $page_bar += '<li class="page-item"><a class="page-link page-article" href="#">' + $p + '</a></li>';
        }
    }else{
        $page_bar = '<nav aria-label="Page navigation example"><ul class="pagination">';
        $page_bar += '<li class="page-item"><a class="page-link page-article" href="#">1</a></li>';
        for (var $q = $page - 2; $q <= $page + 2; $q++){
            $page_bar += '<li class="page-item"><a class="page-link page-article" href="#">' + $q + '</a></li>';
        }
        $page_bar += '<li class="page-item"><a style="border:none;">· · ·</a></li>';
        $page_bar += '<li class="page-item"><a class="page-link page-article" href="#">' + $total_page + '</a></li>';
        $page_bar += '</ul></nav>';
    }

    $(".page_bar").html($page_bar);
    $("ul.pagination li:nth-child("+ $page +") a").css("background-color", "#009688").css("color", "#fff");

    screenshotPreview();
}


function dialogConfirmAndCancel($title, $content, callback, $param){
    var $obj={
        type:"slideFromTop",
        close:"false",
        title:$title,
        content:$content,
        btn:["确定","取消"],
        callBack1:function(){
            callback($param);
        },
        callBack2:function(){
            method.msg_close();
        }
    };
    method.msg_layer($obj);
}


$(document).on('click','.checkbox-icon', function () {

    if ($(this).hasClass("chooseAll")){
        $(".checkbox-icon").parent().toggleClass("layui-form-checked");
    }
    else{
        $(this).parent().toggleClass("layui-form-checked");
    }
});


$(document).on('click', '.sorting', function () {

    $('.sorting').siblings().not($(this)).removeClass('asc').removeClass('desc');
    if (!$(this).hasClass('asc') && !$(this).hasClass('desc')){
        $(this).addClass("asc");
    }else if($(this).hasClass('asc')){
        $(this).removeClass("asc").addClass("desc");
    }else{
        $(this).removeClass("desc").addClass("asc");
    }

    var $page_size = $(".page_size").val();
    var $asc = $(this).hasClass("asc");
    var $desc = $(this).hasClass("desc");
    var $order_by = $(this).attr("data-url");
    var $url = "http://127.0.0.1:1110/dashboard/posts/list";
    if ($asc && $page_size){
        $url += '?order_by=' + $order_by + '&asc&page_size=' + $page_size;
    }
    if ($desc && $page_size){
        $url += '?order_by=' + $order_by + '&desc&page_size=' + $page_size;
    }

    getTableData($url, true, renderingArticleTable);

});


$(document).on('click', '.page-article', function () {

    var $page_size = $(".page_size").val();
    var $asc = $(this).hasClass("asc");
    var $desc = $(this).hasClass("desc");
    var $order_by = $(this).attr("data-url");
    var $page = $(this).text();
    var $url = "http://127.0.0.1:1110/dashboard/posts/list";

    if ($asc){
        $url += '?order_by=' + $order_by + '&asc'
    }else if($desc){
        $url += '?order_by=' + $order_by + '&desc'
    }else{

    }

    if (!$asc && !$desc && $page_size){
        $url += '?page_size=' + $page_size;
    }else{
        $url = '&page_size=' + $page_size;
    }

    if (!$asc && !$desc && !$page_size && $page){
        $url += '?page=' + $page;
    }else{
        $url += '&page=' + $page;
    }

    getTableData($url, true, renderingArticleTable);
});


$(document).on('click', '.show-cover', function () {
    var $view_cover = '<img src="'+ $(this).attr('rel') + '" style="height:700px; width:1300px;">';
    $(".view-cover").html($view_cover);
});


$(document).on('click', '.show_status', function () {
    var $text = "是";
    var $content = "确定要将这篇文章公开吗?";
    if (!$(this).hasClass('layui-form-onswitch')){

    }else{
        $text = "否";
        $content = "确定要将这篇文章隐藏吗?";
    }

    dialogConfirmAndCancel('Confirm your operation.', $content, function ($e) {
        $e.toggleClass('layui-form-onswitch');
        $e.children('em').text($text);

        method.msg_layer({title:"确认框标题",content:"保存成功"});
    }, $(this));
});


$(document).on('click', '.is_top', function () {
    var $text = "是";
    var $content = "确定要将这篇文章置顶吗?";
    if (!$(this).hasClass('layui-form-onswitch')){
        $content = "确定要将这篇文章置顶吗?";
    }else{
        $text = "否";
        $content = "确定要将这篇文章取消置顶吗?";
    }

    dialogConfirmAndCancel('Confirm your operation.', $content, function ($e) {
        $e.toggleClass('layui-form-onswitch');
        $e.children('em').text($text);

        method.msg_layer({title:"确认框标题",content:"保存成功"});
    }, $(this));
});


$(document).on('click', '.batchDel', function (event) {
    dialogConfirmAndCancel('Confirm your operation.', '确定要将选中的文章删除吗?', function () {
        event.preventDefault();
        var $item = $("[class*='layui-form-checked']").parent().parent();
        $item.addClass('removed-item')
            .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
            $item.remove();
        });
    })
});


$(document).on('click', '.news_collect', function () {
    if (!$(this).hasClass("collected")) {
        $(this).html('<i class="fa fa-star" aria-hidden="true"></i></i> <span>已收藏</span>');
    }else{
        $(this).html('<i class="fa fa-star-o" aria-hidden="true"></i> <span>收藏</span>');
    }
    $(this).toggleClass("collected");
});


function turnFullScreen(editor) {
    // $("#mainNav").toggleClass("d-none");
    SimpleMDE.toggleFullScreen(editor);
}


function mdEditor(){
    return new SimpleMDE({
        element: document.getElementById("write_article"),
        spellChecker: false,
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
            action: SimpleMDE.togglePreview,
            className: "fa fa-eye no-disable",
            title: "Toggle Preview"
        },
        {
            name: "side-by-side",
            action: SimpleMDE.toggleSideBySide,
            className: "fa fa-columns no-disable no-mobile",
            title: "Toggle Side by Side"
        },
        {
            name: "fullscreen",
            action: turnFullScreen,
            className: "fa fa-arrows-alt no-disable no-mobile",
            title: "Toggle Fullscreen"
        },
        {
            name: "guide",
            action: "www.baidu.com",
            className: "fa fa-question-circle",
            title: "Markdown Guide"
        }],
        shortcuts: {
		    singleSelection: null
            // drawLink: 'ESC'
	    },
    });
}


this.screenshotPreview = function(){

    var xOffset = 10;
    var yOffset = 30;

	$("a.screenshot").hover(function(e){
		this.t = this.title;
		this.title = "";
		var c = (this.t != "") ? "<br/>" + this.t : "";
		$("body").append("<p id='screenshot'><img src='"+ this.rel +"' alt='url preview' />"+ c +"</p>");
		$("#screenshot")
            .css("top",(e.pageY - xOffset) + "px")
            .css("left",(e.pageX + yOffset) + "px")
            .css("width", "190px")
            .css("height", "190px")
            .css("overflow", "hidden")
            .fadeIn("fast");
		$("#screenshot img").css("width", "190px").css("height", "190px");
    },
	function(){
		this.title = this.t;
		$("#screenshot").remove();
    });
	$("a.screenshot").mousemove(function(e){
		$("#screenshot")
            .css("top",(e.pageY - xOffset) + "px")
            .css("left",(e.pageX + yOffset) + "px")
            .css("overflow", "hidden");
		$("#screenshot img").css("width", "190px").css("height", "190px");
	});
};


/*
 * Inline Text Attachment
 *
 * Author: Roy van Kaathoven
 * Contact: ik@royvankaathoven.nl
 */

var inlineAttachment = function(options, instance) {
  this.settings = inlineAttachment.util.merge(options, inlineAttachment.defaults);
  this.editor = instance;
  this.filenameTag = '{filename}';
  this.lastValue = null;
};

/**
 * Will holds the available editors
 *
 * @type {Object}
 */
inlineAttachment.editors = {};

/**
 * Utility functions
 */
inlineAttachment.util = {

  /**
   * Simple function to merge the given objects
   *
   * @param {Object[]} object Multiple object parameters
   * @returns {Object}
   */
  merge: function() {
    var result = {};
    for (var i = arguments.length - 1; i >= 0; i--) {
      var obj = arguments[i];
      for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
          result[k] = obj[k];
        }
      }
    }
    return result;
  },

  /**
   * Append a line of text at the bottom, ensuring there aren't unnecessary newlines
   *
   * @param {String} appended Current content
   * @param {String} previous Value which should be appended after the current content
   */
  appendInItsOwnLine: function(previous, appended) {
    return (previous + "\n\n[[D]]" + appended)
      .replace(/(\n{2,})\[\[D\]\]/, "\n\n")
      .replace(/^(\n*)/, "");
  },

  /**
   * Inserts the given value at the current cursor position of the textarea element
   *
   * @param  {HtmlElement} el
   * @param  {String} value Text which will be inserted at the cursor position
   */
  insertTextAtCursor: function(el, text) {
    var scrollPos = el.scrollTop,
      strPos = 0,
      browser = false,
      range;

    if ((el.selectionStart || el.selectionStart === '0')) {
      browser = "ff";
    } else if (document.selection) {
      browser = "ie";
    }

    if (browser === "ie") {
      el.focus();
      range = document.selection.createRange();
      range.moveStart('character', -el.value.length);
      strPos = range.text.length;
    } else if (browser === "ff") {
      strPos = el.selectionStart;
    }

    var front = (el.value).substring(0, strPos);
    var back = (el.value).substring(strPos, el.value.length);
    el.value = front + text + back;
    strPos = strPos + text.length;
    if (browser === "ie") {
      el.focus();
      range = document.selection.createRange();
      range.moveStart('character', -el.value.length);
      range.moveStart('character', strPos);
      range.moveEnd('character', 0);
      range.select();
    } else if (browser === "ff") {
      el.selectionStart = strPos;
      el.selectionEnd = strPos;
      el.focus();
    }
    el.scrollTop = scrollPos;
  }
};

/**
 * Default configuration options
 *
 * @type {Object}
 */
inlineAttachment.defaults = {
  /**
   * URL where the file will be send
   */
  uploadUrl: 'upload_attachment.php',

  /**
   * Which method will be used to send the file to the upload URL
   */
  uploadMethod: 'POST',

  /**
   * Name in which the file will be placed
   */
  uploadFieldName: 'file',

  /**
   * Extension which will be used when a file extension could not
   * be detected
   */
  defaultExtension: 'png',

  /**
   * JSON field which refers to the uploaded file URL
   */
  jsonFieldName: 'filename',

  /**
   * Allowed MIME types
   */
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif'
  ],

  /**
   * Text which will be inserted when dropping or pasting a file.
   * Acts as a placeholder which will be replaced when the file is done with uploading
   */
  progressText: '![Uploading file...]()',

  /**
   * When a file has successfully been uploaded the progressText
   * will be replaced by the urlText, the {filename} tag will be replaced
   * by the filename that has been returned by the server
   */
  urlText: "![file]({filename})",

  /**
   * Text which will be used when uploading has failed
   */
  errorText: "Error uploading file",

  /**
   * Extra parameters which will be send when uploading a file
   */
  extraParams: {},

  /**
   * Extra headers which will be send when uploading a file
   */
  extraHeaders: {},

  /**
   * Before the file is send
   */
  beforeFileUpload: function() {
    return true;
  },

  /**
   * Triggers when a file is dropped or pasted
   */
  onFileReceived: function() {},

  /**
   * Custom upload handler
   *
   * @return {Boolean} when false is returned it will prevent default upload behavior
   */
  onFileUploadResponse: function() {
    return true;
  },

  /**
   * Custom error handler. Runs after removing the placeholder text and before the alert().
   * Return false from this function to prevent the alert dialog.
   *
   * @return {Boolean} when false is returned it will prevent default error behavior
   */
  onFileUploadError: function() {
    return true;
  },

  /**
   * When a file has succesfully been uploaded
   */
  onFileUploaded: function() {}
};

/**
 * Uploads the blob
 *
 * @param  {Blob} file blob data received from event.dataTransfer object
 * @return {XMLHttpRequest} request object which sends the file
 */
inlineAttachment.prototype.uploadFile = function(file) {
  var me = this,
    formData = new FormData(),
    xhr = new XMLHttpRequest(),
    settings = this.settings,
    extension = settings.defaultExtension || settings.defualtExtension;

  if (typeof settings.setupFormData === 'function') {
    settings.setupFormData(formData, file);
  }

  // Attach the file. If coming from clipboard, add a default filename (only works in Chrome for now)
  // http://stackoverflow.com/questions/6664967/how-to-give-a-blob-uploaded-as-formdata-a-file-name
  if (file.name) {
    var fileNameMatches = file.name.match(/\.(.+)$/);
    if (fileNameMatches) {
      extension = fileNameMatches[1];
    }
  }

  var remoteFilename = "image-" + Date.now() + "." + extension;
  if (typeof settings.remoteFilename === 'function') {
    remoteFilename = settings.remoteFilename(file);
  }

  formData.append(settings.uploadFieldName, file, remoteFilename);

  // Append the extra parameters to the formdata
  if (typeof settings.extraParams === "object") {
    for (var key in settings.extraParams) {
      if (settings.extraParams.hasOwnProperty(key)) {
        formData.append(key, settings.extraParams[key]);
      }
    }
  }

  xhr.open('POST', settings.uploadUrl);

  // Add any available extra headers
  if (typeof settings.extraHeaders === "object") {
      for (var header in settings.extraHeaders) {
          if (settings.extraHeaders.hasOwnProperty(header)) {
              xhr.setRequestHeader(header, settings.extraHeaders[header]);
          }
      }
  }

  xhr.onload = function() {
    // If HTTP status is OK or Created
    if (xhr.status === 200 || xhr.status === 201) {
      me.onFileUploadResponse(xhr);
    } else {
      me.onFileUploadError(xhr);
    }
  };
  if (settings.beforeFileUpload(xhr) !== false) {
    xhr.send(formData);
  }
  return xhr;
};

/**
 * Returns if the given file is allowed to handle
 *
 * @param {File} clipboard data file
 */
inlineAttachment.prototype.isFileAllowed = function(file) {
  if (file.kind === 'string') { return false; }
  if (this.settings.allowedTypes.indexOf('*') === 0){
    return true;
  } else {
    return this.settings.allowedTypes.indexOf(file.type) >= 0;
  }
};

/**
 * Handles upload response
 *
 * @param  {XMLHttpRequest} xhr
 * @return {Void}
 */
inlineAttachment.prototype.onFileUploadResponse = function(xhr) {
  if (this.settings.onFileUploadResponse.call(this, xhr) !== false) {
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
    }
  }
};


/**
 * Called when a file has failed to upload
 *
 * @param  {XMLHttpRequest} xhr
 * @return {Void}
 */
inlineAttachment.prototype.onFileUploadError = function(xhr) {
  if (this.settings.onFileUploadError.call(this, xhr) !== false) {
    var text = this.editor.getValue().replace(this.lastValue, "");
    this.editor.setValue(text);
  }
};

/**
 * Called when a file has been inserted, either by drop or paste
 *
 * @param  {File} file
 * @return {Void}
 */
inlineAttachment.prototype.onFileInserted = function(file) {
  if (this.settings.onFileReceived.call(this, file) !== false) {
    this.lastValue = this.settings.progressText;
    this.editor.insertValue(this.lastValue);
  }
};


/**
 * Called when a paste event occured
 * @param  {Event} e
 * @return {Boolean} if the event was handled
 */
inlineAttachment.prototype.onPaste = function(e) {
  var result = false,
    clipboardData = e.clipboardData,
    items;

  if(!(e.clipboardData && e.clipboardData.items && e.clipboardData.items.length)){
      method.msg_layer({title:"提示", content:"该浏览器不支持图片的粘贴"});
      method.msg_close();
      return;
  }

  if (typeof clipboardData === "object") {
    items = clipboardData.items || clipboardData.files || [];


    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (this.isFileAllowed(item)) {
        result = true;
        this.onFileInserted(item.getAsFile());
        this.uploadFile(item.getAsFile());
      }else{
           method.msg_layer({title:"提示", content:"不支持的文件格式"});
           method.msg_close();
      }
    }
  }

  if (result) { e.preventDefault(); }

  return result;
};

/**
 * Called when a drop event occures
 * @param  {Event} e
 * @return {Boolean} if the event was handled
 */
inlineAttachment.prototype.onDrop = function(e) {
  var result = false;
  for (var i = 0; i < e.dataTransfer.files.length; i++) {
    var file = e.dataTransfer.files[i];
    if (this.isFileAllowed(file)) {
      result = true;
      this.onFileInserted(file);
      this.uploadFile(file);
    }else{
           method.msg_layer({title:"提示", content:"不支持的文件格式"});
           method.msg_close();
    }
  }

  return result;
};

window.inlineAttachment = inlineAttachment;


/**
* CodeMirror version for inlineAttachment
*
* Call inlineAttachment.attach(editor) to attach to a codemirror instance
*/

var codeMirrorEditor = function(instance) {

  if (!instance.getWrapperElement) {
    throw "Invalid CodeMirror object given";
  }

  this.codeMirror = instance;
};

codeMirrorEditor.prototype.getValue = function() {
  return this.codeMirror.getValue();
};

codeMirrorEditor.prototype.insertValue = function(val) {
  this.codeMirror.replaceSelection(val);
};

codeMirrorEditor.prototype.setValue = function(val) {
  var cursor = this.codeMirror.getCursor();
  this.codeMirror.setValue(val);
  this.codeMirror.setCursor(cursor);
};

/**
 * Attach InlineAttachment to CodeMirror
 *
 * @param {CodeMirror} codeMirror
 */
codeMirrorEditor.attach = function(codeMirror, options) {

  options = options || {};

  var editor = new codeMirrorEditor(codeMirror),
    inlineattach = new inlineAttachment(options, editor),
    el = codeMirror.getWrapperElement();

  el.addEventListener('paste', function(e) {
    inlineattach.onPaste(e);
  }, false);

  codeMirror.setOption('onDragEvent', function(data, e) {
    if (e.type === "drop") {
      e.stopPropagation();
      e.preventDefault();
      return inlineattach.onDrop(e);
    }
  });
};

var codeMirrorEditor4 = function(instance) {
  codeMirrorEditor.call(this, instance);
};

codeMirrorEditor4.attach = function(codeMirror, options) {

  options = options || {};

  var editor = new codeMirrorEditor(codeMirror),
    inlineattach = new inlineAttachment(options, editor),
    el = codeMirror.getWrapperElement();

  el.addEventListener('paste', function(e) {
    inlineattach.onPaste(e);
  }, false);

  codeMirror.on('drop', function(data, e) {
    if (inlineattach.onDrop(e)) {
      e.stopPropagation();
      e.preventDefault();
      return true;
    } else {
      return false;
    }
  });
};

inlineAttachment.editors.codemirror4 = codeMirrorEditor4;
