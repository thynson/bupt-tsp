
;(function($){
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

    var updateAnnounce = (function(){
        getJson({
            url : "/announce",
            callback : function(obj) {
                if (obj.err) {
                } else {
                    $("#announce p").text(obj.announce).show();
                    setTimeout(updateAnnounce, 60000);
                }   
            },  
            error : function(obj) {
            }   
        }); 
        return this;
    })();

})($);
