/**
 * Created by tiger on 2017/12/12.
 */


$(".article_list").click(function () {
   $(".container-fluid").html(
       '<ol class="breadcrumb">' +
       '<li class="breadcrumb-item">' +
            '<a href="#">首页</a>' +
       '</li>'+
       '<li class="breadcrumb-item active">文章管理</li>' +
       '<li class="breadcrumb-item active">文章列表</li>' +
       '</ol>' +

       '<blockquote class="dashboard-elem-quote news_search">'+
       '<div class="dashboard-inline">' +
            '<div class="dashboard-input-inline">' +
                '<input type="text" value="" placeholder="请输入关键字" class="dashboard-input search_input">' +
            '</div>' +
            '<a class="dashboard-btn search_btn" href="#">查询</a>' +
       '</div>' +
       '<div class="dashboard-inline">' +
            '<a class="dashboard-btn dashboard-btn-normal add_article" href="#">添加文章</a>' +
       '</div>' +
       '<div class="dashboard-inline">' +
            '<a class="dashboard-btn dashboard-btn-danger article-batchDel" href="#">批量删除</a>' +
       '</div>' +
       '<div class="dashboard-inline" style="font-size:13px; padding-top:8px; float:right;">' +
            '<label class="page-label">页</label>' +
       '</div>' +
       '<div class="dashboard-inline page-size">' +
            '<select name="page_size" aria-controls="dataTable" class="page_size">' +
                '<option value="10">10</option>' +
                '<option value="25">25</option>' +
                '<option value="50">50</option>' +
                '<option value="100">100</option>' +
            '</select>' +
       '</div>' +
       '<div class="dashboard-inline" style="font-size:13px; padding-top:8px; float:right;">' +
           '<label class="page-label">每页显示</label>' +
       '</div>' +
    '</blockquote>' +
    '<div class="dashboard-form news_list">' +
    '<table class="dashboard-table">' +
        '<colgroup>' +
           '<col width="50">' +
           '<col width="9%">' +
           '<col>' +
           '<col width="9%">' +
           '<col width="9%">' +
           '<col width="9%">' +
           '<col width="9%">' +
           '<col width="9%">' +
        '</colgroup>' +
        '<thead>' +
            '<tr>' +
                '<th>' +
                    '<input type="checkbox" name="" lay-skin="primary" id="allChoose">' +
                    '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">' +
                        '<div class="checkbox-icon chooseAll" title="反选">&nbsp;</div>' +
                    '</div>' +
                '</th>' +
                '<th>封面</th>' +
                '<th class="sorting" data-url="article_title" style="text-align:left;">文章标题</th>' +
                '<th>发布人</th>' +
                '<th class="sorting" data-url="category_id">文章分类</th>' +
                '<th>是否公开</th>' +
                '<th>发布时间</th>' +
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

    var $url = $root + '/v1/posts';
    getTableData($url, true, renderingArticleTable);
});


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
        $table_content += '<tr data-id="' + $post_list[$i].post_id + '">';
        $table_content += '<td>';
        $table_content += '<input type="checkbox" name="checked" lay-skin="primary" class="choose">';
        $table_content += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
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
        $table_content += '<td>' + $post_list[$i].category.category_name + '</td>';

        if ($post_list[$i].show_status == 0){
            $table_content += '<td><input type="checkbox" name="show" lay-skin="switch" checked="">';
            $table_content += '<div class="dashboard-unselect dashboard-form-switch show_status">';
            $table_content += '<em>否</em><i></i></div></td>';
        }else{
            $table_content += '<td><input type="checkbox" name="show" lay-skin="switch" checked="">';
            $table_content += '<div class="dashboard-unselect dashboard-form-switch dashboard-form-onswitch show_status">';
            $table_content += '<em>是</em><i></i></div></td>';
        }

        $table_content += '<td>' + $post_list[$i].updated_at + '</td>';
        $table_content += '<td><a class="dashboard-btn dashboard-btn-mini article_edit">';
        $table_content += '<i class="fa fa-pencil-square-o" aria-hidden="true"></i> <span>编辑</span></a></td></tr>';
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
    var $url = $root + "/v1/posts";
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
    var $url = $root + "/v1/posts";

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


$(document).on('click', '.article-batchDel', function () {
    var $post_list = $("[class*='dashboard-form-checked']");

    if (!($("div.dashboard-form-checkbox").hasClass("dashboard-form-checked"))){
        method.msg_layer({title:"提示", content:"请选择需要删除的文章!"});
        method.msg_close();
        return
    }

    var $item = $post_list.parent().parent();
    $item.addClass('removed-item')
        .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
        $item.remove();
    });

    var $post_list_id = [];
    $.each($post_list, function () {
        $post_list_id.push($(this).parent().closest('tr').attr('data-id'));
    });
    $post_list_id.slice(0);

    var $url = $root + '/v1/posts/batch_delete';

    $.ajax({
        type: 'POST',
        url: $url,
        data: {post_id_list: JSON.stringify($post_list_id)},
        success: function () {
        }
    });
});


$(document).on('click', '.show_status', function () {
    var $post_id = $(this).parent().closest('tr').attr("data-id");

    var $url = $root;
    if ($(this).hasClass('dashboard-form-onswitch')){
        $url += '/v1/post/' + $post_id + '/hide';
    }else{
        $url += '/v1/post/' + $post_id + '/public';
    }

    $(this).toggleClass("dashboard-form-onswitch");

    $.ajax({
        type: 'GET',
        url: $url,
        success: function () {

        }
    });
});


$(document).on('click', '.select_image_icon', function () {
    $(".select_image_icon").removeClass("dashboard-icon-checked");
    $(this).toggleClass("dashboard-icon-checked");
});