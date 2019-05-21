$(function() {
    //初始化
    $("html,body").animate({"scrollTop": "0"},1);

    //基本信息
    var company="dawangka",url=window.location.href,request=getRequestByName("sign"),startTime = new Date().getTime();
    var userId=getUUID(),ip=returnCitySN["cip"],ua=navigator.userAgent;

    //保存页面初始化信息 http://mm.jnrise.cn/loading/server/enter
    $.ajax({
        type:'POST',
        url: 'http://mm.jnrise.cn/loading/server/enter',
        headers:{"Content-Type":"application/x-www-form-urlencoded"},
        data:{
            'company':company,
            'userId':userId,
            'url':url,
            'ip':ip,
            'userAgent':ua,
            'sign':request,
            'flag':2
        },
        dataType: 'json',
        success: function(data){
            //console.log(data);
        },
        error: function(xhr){
            console.log(xhr);
        }
    });

    //每秒刷新页面停留时间
    var timer=window.setInterval(function(){
        var time=getShowTimes(startTime);
        if(time<=90){
            //console.log(time);
            $.ajax({
                type:'POST',
                url: 'http://mm.jnrise.cn/loading/server/stay',
                headers:{"Content-Type":"application/x-www-form-urlencoded"},
                data:{
                    'company':company,
                    'userId':userId,
                    'url':url,
                    'ip':ip,
                    'userAgent':ua,
                    'sign':request,
                    'totalTime':time,
                    'otherInfo':''
                },
                dataType: 'json',
                success: function(data){
                    //console.log(data);
                },
                error: function(xhr){
                    console.log(xhr);
                }
            });
        }else{
            //console.log("stop");
            window.clearInterval(timer);
        }
    },1000);

    //记录页面表单操作数据
    var device=0;
    if(/Android|iPhone|BlackBerry/i.test(navigator.userAgent)) {
        device=1;
    }else{
        device=0;
    }

    //点击按钮跳转
    $(".content-btn").click(function () {
        $.ajax({
            type:'POST',
            url: 'http://mm.jnrise.cn/loading/server/click',
            data:{
                'sign':request,
                'uuid':userId,
                'deviceType':device,
                'clickType':3,//text-click:1,text-change:2,button-click:3
                'company':company,
                'url':url,
                'ip':ip,
                'userAgent':ua,
                'userId':userId,
                'otherInfo':'.content-btn'
            },
            success: function(data){
                //console.log(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });

        window.location.href="https://jdtongxin.jd.com/wangka/#/form?channel=thinkerjet&storeCode=STR201903290028&sysCode=UNICOM";
    });

    //记录点击次数及点击坐标-540基准图
    $(".main").on("click",function(){
        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;

        var x = (e.pageX || e.clientX + scrollX)-$(".main")[0].offsetLeft;
        var y = (e.pageY || e.clientY + scrollY);

        var w=$(".main").width();
        var h=$(".main").height();

        var x1= Math.round(x*540/w);
        var y1= Math.round(y*540/w);

        //console.log('click\nx: ' + x + '\ny: ' + y+"\nw:"+w+"\nh:"+h+"\nx1:"+x1+"\ny1:"+y1);

        $.ajax({
            type:'POST',
            url: 'http://mm.jnrise.cn/loading/server/clickCount',
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            data:{
                'company':company,
                'url':url,
                'ip':ip,
                'userAgent':ua,
                'userId':userId,
                'type':'click',
                'coordinate':x1+","+y1,
                'otherInfo':'x: ' + x + ',y: ' + y+",w:"+w+",h:"+h
            },
            dataType: 'json',
            success: function(data){
                //console.log(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    });
});

//获取Url参数
function getRequestByName(name) {
    var url = window.location.search; //获取url中"?"符后的字串
    var result="";
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            if(strs[i].indexOf(name+"=")!=-1){
                result= unescape(strs[i].substring(name.length+1,strs[i].length));
            }
        }
    }
    return result;
}
//页面停留时间
function getShowTimes (start_time){
    var time_now = new Date();
    var i_total_secs = Math.round((time_now.getTime() - start_time)/1000);
    return i_total_secs;
}
//创建UUID
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}
function getUUID(){
    var times=new Date().getTime().toString();
    return uuid(8,16)+times.substr(6,8);
}


