
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
                        location.href = "/panel.html";
                    }
                } catch(e) {
                    errHandler();
                }
            },
            error : errHandler
        });
    });

})($);
