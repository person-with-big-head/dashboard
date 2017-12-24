/**
 * Created by tiger on 2017/12/21.
 */


$.ajax({
   type: 'GET',
   url: $root + '/v1/auth/verify_code',
   data: {token: random_string()},
   success: function (data) {
       if (data){
           var $img_url = "data:image/gif;base64," + data;
           $('.code_image img').attr('src', $img_url);
       }
   }
});


$(".login").click(function () {
   var $username = $(".username").val();
   var $password = $(".password").val();
   var $captcha = $(".input_code").val();

   if (!$password || !$username || !$captcha ||$password.length < 5 || $username.length < 3 || $captcha.length != 4){
       $(".fancybar-text").text("Oops, something goes wrong. Keep that all the field are filled correctly.");
       $("._bsa_fancybar").css("display", "block");
   }else{
       $.ajax({
           type: 'POST',
           url:  $root + '/v1/auth/login',
           data: {username: $username, password: $password, captcha: $captcha},
           success: function (data) {
              if (data && data.data &&data.data.code != '200'){
                  $(".fancybar-text").text(data.data.text);
                  $("._bsa_fancybar").css("display", "block");
              } else{
                  window.location.href = data.data.redirect_url;
              }
           }
       })
   }
});


$(".code_image img").click(function () {
   $.ajax({
       type: 'GET',
       url: $root + '/v1/auth/verify_code',
       data: {token: random_string()},
       success: function (data) {
           if (data){
               var $img_url = "data:image/gif;base64," + data;
               $('.code_image img').attr('src', $img_url);
           }
       }
   });
});

$(".fancybar-close").click(function () {
    $("._bsa_fancybar").css("display", "none");
});


function random_string() {
    return new Array(20).join().replace(/(.|$)/g, function() {
        return ((Math.random()*36)|0).toString(36)[Math.random()<.5?"toString":"toUpperCase"]();
    });
}