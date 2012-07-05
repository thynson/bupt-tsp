
;(function($){

    if($.browser.msie && $.browser.version < 7.999) {
        if($.browser.version < 6.999) {
            $('#browserWarning .modal-body').appendTo("#container");
            $("#content").empty().css("text-align", "center");
            $('.modal-body').appendTo("#content");
        }else{
            $('#browserWarning').modal({backdrop: false});
        }
    }

    var errHandler = function() {
        alertInternalError(".alert");
    };

    ajaxSubmit($("#loginForm"), function(){
        var username = $("#username").val();
        var password = $("#password").val();
        var hash = $.sha1(password+$.sha1(username));
        var postData = "username="
            + encodeURIComponent(username)
            + "&password="
            + encodeURIComponent(hash);

        postJson({
            url : "/login",
            data : postData,
            callback : function(obj){
                try {
                    if (obj.err) {
                        alertFailure(".alert", obj.err);
                    } else {
                        // Clear cookie first
                        $.cookie("username", null);
                        $.cookie("role", null);

                        $.cookie("username", username);
                        $.cookie("role", obj.role);
                        location.href = "/panel.html";
                    }
                } catch(e) {
                    errHandler();
                }
            },
            error : errHandler
        });
    });

    var updatePhase = function(){
        getJson({
            url : "/phase",
            callback : function(obj) {
                if(obj.err){
                }else{
                    $("#phaseText").text("当前阶段为").append($("<b/>").text(localePhase(obj.phase))).show();
                }
            }   
        }); 
    }   

    updatePhase();



    window.updateAnnounce = (function(){
        getJson({
            url : "/announce?time=" + new Date().getTime(),
            callback : function(obj) {
                if (obj.err) {
                } else {
                    if(obj.announce && obj.announce != "") {
                        $("#announce pre").text(obj.announce).show();
                    }else{
                        $("#announce pre").text("无公告").show();
                    }
                    setTimeout("updateAnnounce();", 60000);
                }
            },
            error : function(obj) {
                setTimeout("updateAnnounce();", 60000);
            }
        });
    });

    updateAnnounce();

})($);
