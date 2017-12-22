/**
 * Created by tiger on 2017/12/21.
 */

$(".login").click(function () {
   var $username = $(".username").val();
   var $password = $(".password").val();

   if (!$password || !$username || $password.length < 5 || $username.length < 5){
       $(".fancybar-text").text("Oops, something goes wrong. Keep that all the field are filled correctly.");
       $("._bsa_fancybar").css("display", "block");
   }else{
       $.ajax({
           type: 'POST',
           url: 'http://127.0.0.1:1110/v1/auth/login',
           data: {username: $username, password: $password},
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