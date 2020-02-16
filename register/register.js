function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') > 0) ? parseInt(myNav.split('msie')[1]) : false;
}
if (isIE()) {
    alert(
      '您正在使用的 IE 浏览器可能会导致兼容性问题。请使用 Edge，Chrome，Firefox 或其他现代浏览器。'
      + '\n\nThe browser Internet Explorer you\'re currently using might cause compatibility issues.' 
      + ' Please switch to more recent versions of Microsoft Edge, Google Chrome, or Firefox.'
    );
}

var user = document.getElementById("user");
var pw = document.getElementById("pw");
var rePw = document.getElementById("rePw");
//user.required = "required";
user.autocomplete = "off";
user.placeholder = "账号";
//pw.required = "required";
pw.placeholder = "密码";
//rePw.required = "required";
rePw.placeholder="确认密码";

function PostHandle(url,data,callback) {
    $.ajax({
        async: false,//同步请求，在没有返回值之前，同步请求将锁住浏览器，ajax后的操作必须等待success的函数完成才可以执行。
        type: "POST",
        url: url,
        data: data,
        dataType: 'json',
        // headers: {
        //     "Content-Type": "application/json"
        // },//如不行则添加
        success: function (data){
            callback(data);
        },//对回调函数进行修改
        error: function (xhr){
            alert("错误提示： " + xhr.status + " " + xhr.statusText);
        },
    });
}
function checkIt(ele){
    if(ele.value != ""){
        ele.className = "form-control";
        rePwError.style.display = "none";
    }
}
function login(){
    var user = document.getElementById("user");
    var pw = document.getElementById("pw");
    var rePw = document.getElementById("rePw");
    var rePwError = document.getElementById("rePwError");

    if(user.value == ""){
        user.className = "form-control error";
    }
    else if(pw.value == ""){
        pw.className = "form-control error";
    }
    else if(rePw.value == ""){
        rePw.className = "form-control error";
    }
    else if(pw.value != rePw.value){
        rePw.value = "";
        rePwError.style.display = "block";
    }
    else{
        var username = document.getElementById("user").value;
        var password = document.getElementById("pw").value;
        var rePassword = document.getElementById("rePw").value;//后端要求
        var info = {
            username: username,
            password: password,
            repassword: rePassword//后端要求
        };
        var urlStr = "/register";
        // var urlStr = "https://easy-mock.com/mock/5e2ba543b6f7d03b38a93e89/example/register";
        PostHandle(urlStr, info, function(data){
            var status = "success";
            if(data.code == 1){
                swal({
                    title: data.message,
                    text: "跳转中。。。",
                    type: status,
                });
                setTimeout(function(){ window.location.href = "/login"; }, 2000);
                // setTimeout(function(){ window.location.replace("http://127.0.0.1:5500/login/login.html"); }, 3000);
            }
            else{
                status = "error";
                swal({
                    title: data.message,
                    text: "跳转中。。。",
                    type: status,
                    confirmButtonText: "继续"
                });
                setTimeout(function(){ window.location.href = "/register"; }, 2000);
                // setTimeout(function(){ window.location.replace("http://127.0.0.1:5500/register/register.html"); }, 3000);
            }
        });
    }
}
