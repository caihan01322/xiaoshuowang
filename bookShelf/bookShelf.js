function PostHandle(url,data,callback) {
    // var identityCode;
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
    // return identityCode;
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

    PostHandle("/bookshelf", {isLogin:"unKnow"}, function(data){
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
                $("#identity").attr("data-identity-code","0");//设置登录身份
                $("#user-add").css("display","inline-block");
                $("#search").css("display","none");
                $(".alter-btn").css("display","none");
                $(".delete-btn").css("display","inline-block");
            }
            else if(data.isadmin == 1){
                identity = "管理员";
                $("#identity").attr("data-identity-code","1");//设置登录身份
                $("#user-add").css("display","none");
                $("#search").css("display","inline-block");
                $(".alter-btn").css("display","inline-block");
                $(".delete-btn").css("display","inline-block");
            }
            else if(data.isadmin == 2){
                identity = "作家";
                $("#identity").attr("data-identity-code","2");//设置登录身份
                $("#user-add").css("display","none");
                $("#search").css("display","inline-block");
                $(".alter-btn").css("display","none");//作家不修改书籍
                $(".delete-btn").css("display","inline-block");//作家可删除书籍
            }
            $("#identity").text(identity);
        }//已登录
    });//判断登录状态

    var options={
        bootstrapMajorVersion:3,    //版本
        currentPage:'{{ .page }}',   //当前页数
        numberOfPages:'{{ .pageRow }}',    //最多显示Page页
        totalPages:'{{ .pageRowSum }}',    //所有数据可以显示的页数
        itemTexts: function (type, page, current) {
            switch (type) {
                case "first":
                    return "首页";
                case "prev":
                    return "上一页";
                case "next":
                    return "下一页";
                case "last":
                    return "末页";
                case "page":
                    return page;
            }
        },
        onPageClicked:function(e,originalEvent,type,page){
            // console.log("e");
            // console.log(e);
            // console.log("originalEvent");
            // console.log(originalEvent);
            // console.log("type");
            // console.log(type);
            // console.log("page");
            // console.log(page);
            window.location.href = "/?p=" + page
        }
    }
    $("#page").bootstrapPaginator(options);//渲染分页

    $("#iCenter").mouseenter(function(){
        $("#iCenter").attr("class","dropdown open");
    });//不用mouseover，避免事件的过多触发导致资源占用过高
    $("#iCenter").mouseleave(function(){
        $("#iCenter").attr("class","dropdown");
    });//不用mouseout，避免事件的过多触发导致资源占用过高
    $("#iCenter").click(function(){
        $("#iCenter").attr("class","dropdown open");
    });//兼容移动端

    $(".alter-btn").click(function(){
        $(".alter-btn").css("display","none");
        $(".delete-btn").css("display","none");
        $(".confirm-btn").css("display","inline-block");
        $(".cancel-btn").css("display","inline-block");
        var children = $(this).parent().parent().children().toArray();
        var inputObj = "<input type='text' />";
        var preText = new Array(3);
        for(var i=0;i<=2;i++){
            preText[i] = $($(children[i]).children()).html().trim();//.trim()：去除首尾的空白字符
            // console.log("1"+preText[i]+"1");
            $(children[i]).html("");
            $(inputObj).width($(children[i]).width()).height($(children[i]).height()).val(preText[i]).appendTo(children[i]);
            //appendTo() 方法在被选元素的结尾（仍然在内部）插入指定内容。
        }
    });//修改（管理员）

    $(".delete-btn").click(function(){
        var children = $(this).parent().parent().children().toArray();
        var book_name = $($(children[0]).children()).html().trim();
        var book_author = $($(children[1]).children()).html().trim();;
        var book_classes = $($(children[2]).children()).html().trim();
        var identity_code;
        identity_code = $("#identity").attr("data-identity-code");
        // console.log(identity_code);
        var delete_info = JSON.stringify({
            book_name: book_name,
            book_author: book_author,
            book_classes: book_classes,
            identity_code: identity_code
        });//能接收json格式字符串，存疑，推测原因是请求报文头含本应加上去的"Content-Type": "application/json"
        var obj;
        obj = $(this).parent().parent();//回调函数前先写入变量;
        // swal({
        //     title: "是否确认删除？",
        //     text: "删除之后无法恢复！",
        //     icon: "warning",
        //     showCancelButton: true,
        //     confirmButtonColor: "red",
        //     confirmButtonText: "确认",
        //     cancelButtonText: "取消",
        //     closeOnConfirm: false,
        // },function(isConfirm){if (isConfirm){ }})

        var flag = confirm("是否确认删除？");
        if(flag == true){
            PostHandle("删除书籍的路由", delete_info, function(data){
                var status = "success";
                if(data.code == 1){
                    obj.remove();//直接写$(this).parent().parent()不会起作用。
                    swal({
                        title: data.message,
                        text: "",
                        type: status,
                        confirmButtonText: "继续"
                    });//书籍删除成功
                }
                else{
                    status = "error";
                    swal({
                        title: data.message,
                        text: "",
                        type: status,
                        confirmButtonText: "继续"
                    });//书籍删除失败
                }
            });//删除书籍，与后端交互
        }
    });//删除（用户/管理员）

    $(".confirm-btn").click(function(){
        var children = $(this).parent().parent().children().toArray();
        var book_name = $($(children[0]).children()).val().trim();
        var book_author = $($(children[1]).children()).val().trim();
        var book_classes = $($(children[2]).children()).val().trim();
        // if($(children[0]).attr("data-pretext")==book_name && $(children[1]).attr("data-pretext")==book_author && $(children[2]).attr("data-pretext")==book_classes){
        //     $(".alter-btn").css("display","inline-block");
        //     $(".delete-btn").css("display","inline-block");
        //     $(".confirm-btn").css("display","none");
        //     $(".cancel-btn").css("display","none");
        //     var preText = new Array(3);
        //     for(var i=0;i<=2;i++){
        //         preText[i] = $(children[i]).attr("data-pretext");
        //         // console.log(preText[i]);
        //         $(children[i]).html(preText[i]);
        //     }
        //     return "";
        // }//未修改则跳出函数
        var book_info = {
            book_name:book_name,
            book_author:book_author,
            book_classes:book_classes
        }
        PostHandle("根据修改书籍信息的路由",book_info,function(data){
            var status = "success";
            $(".alter-btn").css("display","inline-block");
            $(".delete-btn").css("display","inline-block");
            $(".confirm-btn").css("display","none");
            $(".cancel-btn").css("display","none");
            var children = $(this).parent().parent().children().toArray();
            var preText = new Array(3);
            for(var i=0;i<=2;i++){
                preText[i] = $(children[i]).attr("data-pretext");
                $(children[i]).html(preText[i]);
            }
            if(data.code == 1){
                // $(".alter-btn").css("display","inline-block");
                // $(".delete-btn").css("display","inline-block");
                // $(".confirm-btn").css("display","none");
                // $(".cancel-btn").css("display","none");
                // var children = $(this).parent().parent().children().toArray();
                // var preText = new Array(3);
                // for(var i=0;i<=2;i++){
                //     preText[i] = $($(children[i]).children()).val().trim();//.trim()：去除首尾的空白字符
                //     $(children[i]).attr("data-pretext",preText[i]);//更新data-pretext值
                //     $(children[i]).html(preText[i]);
                // }
                swal({
                    title: data.message,//修改成功
                    text: "",
                    type: status,
                    confirmButtonText: "继续"
                });
            }
            else{
                // $(".alter-btn").css("display","inline-block");
                // $(".delete-btn").css("display","inline-block");
                // $(".confirm-btn").css("display","none");
                // $(".cancel-btn").css("display","none");
                // var children = $(this).parent().parent().children().toArray();
                // var preText = new Array(3);
                // for(var i=0;i<=2;i++){
                //     preText[i] = $(children[i]).attr("data-pretext");
                //     $(children[i]).html(preText[i]);
                // }
                status = "error";
                swal({
                    title: data.message,//修改失败
                    text: "",
                    type: status,
                    confirmButtonText: "继续"
                });
            }
        });//修改书籍信息，与后端交互
    });//确认（管理员）

    $(".cancel-btn").click(function(){
        $(".alter-btn").css("display","inline-block");
        $(".delete-btn").css("display","inline-block");
        $(".confirm-btn").css("display","none");
        $(".cancel-btn").css("display","none");
        var children = $(this).parent().parent().children().toArray();
        var preText = new Array(3);
        for(var i=0;i<=2;i++){
            preText[i] = $(children[i]).attr("data-pretext");
            // console.log(preText[i]);
            $(children[i]).html(preText[i]);
        }
    });//取消（管理员）

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
