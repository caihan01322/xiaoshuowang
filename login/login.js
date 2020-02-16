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

/*免密登录（与后端可能要交互）*/
// function setCookie(key,value,exDay){
//     var d = new Date();
//     d.setTime(d.getTime() + (exDay*24*60*60*1000));
//     var expires = d.toUTCString();
//     document.cookie = key + "=" + value + ";" + "expires=" + expires;
// }
// function removeCookie(key){
//     document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
// }

var user = document.getElementById("user");
var pw = document.getElementById("pw");
if(Cookies.get('username')!=null && Cookies.get('password')!=null){
    user.value = Cookies.get('username');
    pw.value = Cookies.get('password');
}
else{
    user.value = "";
    pw.value = "";
}

var check = document.getElementById("check");
if(check.checked){
    alert("记录密码功能不宜在公共场所(如网吧等)使用,以防密码泄露。请慎重考虑是否使用此功能");
}

var user = document.getElementById("user");
var pw = document.getElementById("pw");
//user.required = "required";
user.autocomplete = "off";
user.placeholder = "账号";
//pw.required = "required";
pw.placeholder = "密码";

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
function checkIt(ele){
    if(ele.value != ""){
        ele.className = "form-control";
    }
}
function login(){
    var user = document.getElementById("user");
    var pw = document.getElementById("pw");
    if(user.value == ""){
        user.className = "form-control error";
    }
    else if(pw.value == ""){
        pw.className = "form-control error";
    }
    else {
        /*免密登录（与后端可能要交互）*/
        var check = document.getElementById("check");
        if(check.checked){
            Cookies.set('username', user.value, { expires: 7 });
            Cookies.set('password', pw.value, { expires: 7 });
        }
        else{
            Cookies.remove('username');
            Cookies.remove('password');
        }

        var username = document.getElementById("user").value;
        var password = document.getElementById("pw").value;
        var info = {
            username: username,
            password: password
        };
        var urlStr = "/login";
        // var urlStr = "login.json";
        // var urlStr = "https://easy-mock.com/mock/5e2ba543b6f7d03b38a93e89/example/login";
        PostHandle(urlStr, info, function(data){
            var status = "success";
            if(data.code == 1){
                swal({
                    title: data.message,
                    text: "跳转中。。。",
                    type: status,  
                });
                setTimeout(function(){ window.location.href = "/index"; }, 2000);
                // setTimeout(function(){ window.location.href = "https://www.baidu.com"; }, 2000);
                // setTimeout(function(){ window.location.replace("http://127.0.0.1:5500/index/index.html"); }, 3000);
            }
            else{
                status = "error";
                swal({
                    title: data.message,
                    text: "跳转中。。。",
                    type: status,
                });
                setTimeout(function(){ window.location.href = "/login"; }, 2000);
                // setTimeout(function(){ window.location.replace("http://127.0.0.1:5500/login/login.html"); }, 3000);
            }
        });
    }
}
