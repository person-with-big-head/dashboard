// image master
$(".cover_list").click(function () {
    var $view_pages = "";
    $view_pages += '<ol class="breadcrumb">';
    $view_pages += '<li class="breadcrumb-item">';
    $view_pages += '<a href="#">首页</a>';
    $view_pages += '</li>';
    $view_pages += '<li class="breadcrumb-item active">封面管理</li>';
    $view_pages += '<li class="breadcrumb-item active">封面列表</li>';
    $view_pages += '</ol>';
    $view_pages += '<form class="dashboard-form cover_list_form">';
    $view_pages += '<blockquote class="dashboard-elem-quote news_search">';
    $view_pages += '<div class="dashboard-inline" style="width: 85%;">';
    $view_pages += '<div class="dashboard-form-mid dashboard-word-aux">数据删除后无法恢复，请谨慎操作</div>';
    $view_pages += '</div>';
    $view_pages += '<div class="dashboard-inline">';
    $view_pages += '<a class="dashboard-btn dashboard-btn-danger confirm-cover-batch-delete" href="#">批量删除</a>';
    $view_pages += '</div>';
    $view_pages += '<div class="dashboard-inline">';
    $view_pages += '<a class="dashboard-btn dashboard-btn-normal next-cover-list" href="#" data-url="1">换一批</a>';
    $view_pages += '</div>';
    $view_pages += '</blockquote>';
    $view_pages += '<ul id="Images" class="manage_cover_list">';

    $view_pages += '</ul>';
    $view_pages += '</form>';
    $(".container-fluid").html($view_pages);

    getCovers(1, renderingCoversList);
});


function renderingCoversList($data){
    // 渲染封面选择列表
    var $page = parseInt($data['page']);
    var $total_page = parseInt($data['total_page']);
    var $cover_list = $data['cover_list'];

    var $manage_cover_list = $(".manage_cover_list");
    var $next_cover_list = $(".next-cover-list");
    $manage_cover_list.empty();

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
        $tag += '<div class="dashboard-icon select_cover_icon"></div>';
        $tag += '</div>';
        $tag += '</div>';
        $tag += '</div>';
        $tag += '</li>';
        $manage_cover_list.append($tag);
    }

    if ($page == $total_page){
        $next_cover_list.attr("data-url", 0);
        $next_cover_list.text("重新浏览");
    }else{
        $next_cover_list.attr("data-url", $page);
        $next_cover_list.text("换一批");
    }
}


$(document).on('click', '.next-cover-list', function () {
    var $data_url = $(this).attr("data-url");
    var $page = parseInt($data_url) + 1;
    getCovers($page, renderingCoversList);
});


$(document).on('click', '.confirm-cover-batch-delete', function () {
    var $cover_list = $("[class*='dashboard-icon-checked']");

    if (!($("div.dashboard-icon").hasClass("dashboard-icon-checked"))){
        swal("提示", "请选择需要删除的文章");
        return;
    }

    swal({
        title: "提示",
        text: "确定将选中的内容删除?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes delete it!",
        closeOnConfirm: false
    },
    function() {
        swal("提示", "已删除.", "success");

        var $item = $cover_list.parent().parent().parent().parent();
        $item.addClass('removed-item')
            .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
                $item.remove();
            });

        var $cover_id_list = [];
        $.each($cover_list, function () {
            $cover_id_list.push($(this).parent().parent().parent().closest('li').attr('data-url'));
        });

        var $url = $root + '/v1/covers/batch_delete';

        $.ajax({
            type: 'POST',
            url: $url,
            data: {cover_id_list: JSON.stringify($cover_id_list)},
            success: function () {
                method.msg_layer({title: "提示", content: "删除成功"});
                method.msg_close();
            }
        });
    });
});

$(document).on('click', '.select_cover_icon', function () {
    $(this).toggleClass("dashboard-icon-checked");
});