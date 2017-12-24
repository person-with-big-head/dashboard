/**
 * Created by tiger on 2017/12/12.
 */


(function($) {
  "use strict"; // Start of use strict

    // view covers.
    $(".panel_images").click(function () {
        var $view_pages = "";
        $view_pages += '<form class="dashboard-form">';
        $view_pages += '<blockquote class="dashboard-elem-quote news_search">';
        $view_pages += '<div class="dashboard-inline"><input type="checkbox" name="selectAll" id="selectAll"';
        $view_pages += 'lay-filter="selectAll" lay-skin="primary" title="全选">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>全选</span><div class="dashboard-icon"></div></div></div><div class="dashboard-inline">';
        $view_pages += '<a class="dashboard-btn dashboard-btn-danger batchDel" href="#">批量删除</a></div>';
        $view_pages += '</blockquote><ul id="Images" class="Image_cover_list">';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '</ul></form>';

        $(".view_images").html($view_pages);

    });

    // image master
    $(".cover_list").click(function () {
        var $view_pages = "";
        $view_pages += '<form class="dashboard-form">';
        $view_pages += '<blockquote class="dashboard-elem-quote news_search">';
        $view_pages += '<div class="dashboard-inline"><input type="checkbox" name="selectAll" id="selectAll"';
        $view_pages += 'lay-filter="selectAll" lay-skin="primary" title="全选">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>全选</span><div class="dashboard-icon"></div></div></div><div class="dashboard-inline">';
        $view_pages += '<a class="dashboard-btn dashboard-btn-danger batchDel" href="#">批量删除</a></div>';
        $view_pages += '</blockquote><ul id="Images" class="Image_cover_list">';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '<li><img src="/static/images/userface3.jpg">';
        $view_pages += '<div class="operate"><div class="check"><input type="checkbox" name="belle"';
        $view_pages += 'lay-filter="choose" lay-skin="primary" title="美女生活照1">';
        $view_pages += '<div class="dashboard-unselect dashboard-form-checkbox" lay-skin="primary">';
        $view_pages += '<span>美女生活照1</span><div class="dashboard-icon"></div></div></div>';
        $view_pages += '<i class="fa fa-trash-o" aria-hidden="true"></i></div></li>';
        $view_pages += '</ul></form>';

        $(".container-fluid").html($view_pages);
    });


    $('.chooseAll').tooltip();

})(jQuery);


$(document).on('click', '.select_image_icon', function () {
    $(".select_image_icon").removeClass("dashboard-icon-checked");
    $(this).toggleClass("dashboard-icon-checked");
});


$(document).on('click','.checkbox-icon', function () {

    if ($(this).hasClass("chooseAll")){
        $(".checkbox-icon").parent().toggleClass("dashboard-form-checked");
    }
    else{
        $(this).parent().toggleClass("dashboard-form-checked");
    }
});


$(document).on('click', '.show-cover', function () {
    var $view_cover = '<img src="'+ $(this).attr('rel') + '" style="height:700px; width:1300px;">';
    $(".view-cover").html($view_cover);
});

$(document).on('click', '.news_collect', function () {
    if (!$(this).hasClass("collected")) {
        $(this).html('<i class="fa fa-star" aria-hidden="true"></i></i> <span>已收藏</span>');
    }else{
        $(this).html('<i class="fa fa-star-o" aria-hidden="true"></i> <span>收藏</span>');
    }
    $(this).toggleClass("collected");
});



