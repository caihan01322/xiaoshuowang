function PostHandle(url,data,callback) {
    $.ajax({
        async: false,//同步请求，在没有返回值之前，同步请求将锁住浏览器，ajax后的操作必须等待success的函数完成才可以执行。
        type: "POST",
        url: url,
        data: data,
        dataType: 'json',
        // headers: {
        //     "Content-Type": "application/json"
        // },//如不行则删掉
        success: function (data){
            callback(data);
        },//对回调函数进行修改
        error: function(xhr){
            alert("错误提示： " + xhr.status + " " + xhr.statusText);
        }
    });
}
function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') > 0) ? parseInt(myNav.split('msie')[1]) : false;
}

$(function (){
    if (isIE()) {
        alert(
          '您正在使用的 IE 浏览器可能会导致兼容性问题。请使用 Edge，Chrome，Firefox 或其他现代浏览器。'
          + '\n\nThe browser Internet Explorer you\'re currently using might cause compatibility issues.' 
          + ' Please switch to more recent versions of Microsoft Edge, Google Chrome, or Firefox.'
        );
    }
    
    PostHandle("/ownInfo", {isLogin:"unKnow"}, function(data){
        if(data.status == 0){
            $("#welcome").css("display","none");
            $("#login").css("display","block");
            $("#register").css("display","block");
            $("#exit").css("display","none");
        }//未登录
        else if(data.status == 1){
            $("#welcome").css("display","block");
            $("#login").css("display","none");
            $("#register").css("display","none");
            $("#exit").css("display","block");
            $("#login-name").text(data.name);
            var identity;
            if(data.isadmin == 0){
                identity = "读者";
            }
            else if(data.isadmin == 1){
                identity = "管理员";
            }
            else if(data.isadmin == 2){
                identity = "作家";
            }
            $("#identity").text(identity);
        }//已登录
    });//判断登录状态

    $("#iCenter").mouseenter(function(){
        $("#iCenter").attr("class","dropdown open");
    });//不用mouseover，避免事件的过多触发导致资源占用过高
    $("#iCenter").mouseleave(function(){
        $("#iCenter").attr("class","dropdown");
    });//不用mouseout，避免事件的过多触发导致资源占用过高
    $("#iCenter").click(function(){
        $("#iCenter").attr("class","dropdown open");
    });//兼容移动端

    
    $("#findBtn").click(function(){
        var urlStr = "";
        var book_name = $("form#search input").val();
        var find_book = {
            book_name:book_name
        };
        //alert(book_name);
        PostHandle(urlStr, find_book, function(data){
            var status = "success";
            if(data.code == 1){
                swal({
                    title: data.message,
                    text: "跳转中。。。",
                    type: status,
                });
                setTimeout(function(){ window.location.href = ""; }, 2000);
            }
            else{
                status = "error";
                swal({
                    title: data.message,
                    text: "跳转中。。。",
                    type: status,
                });
                setTimeout(function(){ window.location.href = ""; }, 2000);
            }
        });
    });//搜索书籍，与后端交互
});
