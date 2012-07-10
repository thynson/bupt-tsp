/*
 * Copyright (c) 2012 School of Software, BUPT
 * Copyright (c) 2012 LAN Xingcan
 * Copyright (c) 2012 CHEN Jie
 *
 * All right reserved
 */

;(function($){

    var phaseText = function(num) {
    }

    var alertSuccessAux = function(alertElement, alertTextElement, text) {
        alertElement.removeClass("alert-error");
        alertTextElement.text(text);
        alertElement.show("fast");
    }

    var alertFailureAux = function(alertElement, alertTextElement, text) {
        alertElement.addClass("alert-error");
        alertTextElement.text(text);
        alertElement.show("fast");
    }

    alertFailure = function(alerter, text) {
        alertFailureAux($(alerter), $(alerter + " .info"), text);
    }

    alertSuccess = function(alerter, text) {
        alertSuccessAux($(alerter), $(alerter + " .info"), text);
    }

    alertInternalError = function(alertElement) {
        alertFailure(alertElement, "系统或网络异常");
    }

    $("div.alert a.close").each(function(i, x){
        $(x).click(function(){
            $(x).parent().hide("fast");
            return false;
        });
    });


	postJson = function(params) {
		return $.ajax({
			type : "POST",
			url : params.url,
			dataType : "json",
			data : params.data,
			success : params.callback,
			error : params.error
		});
	};

	getJson = function(params) {
		return $.ajax({
			type : "GET",
			url : params.url,
			dataType : "json",
			success : params.callback,
			error : params.error
		});
	};


	ajaxSubmit = function(form, callback){
        form.unbind("submit");
		form.submit(function(e){
			try {
				callback();
			} catch(err) {
                alert(err);
			}
			e.preventDefault();
		});
	};

    serializeObject = function(obj) {
        var list = [];
        for (var attr in obj) {
            list.push(attr + '=' + encodeURIComponent(obj[attr]));
        }
        return list.join('&');
    }

    removeFromList = function(selectlist, username) {
        var ret = [];
        $.each(selectlist, function(i, s) {
            if (s.username == username)
                return;
            ret.push(s);
        });
        return ret;
    }

    // Disable Text Selection on label and legend tags
    $("label,.legend").disableSelection();

    $(".legend").click(function(){
        $(this).goTo();
    });

    localePhase = function(index) {
        if(index < 0) return "无";
        return ["选课前准备","学生初选","导师初选","学生补选","导师补选","调剂阶段","最终确认","无"][index];
    }

})($);

// jQuery Extension to goTo

(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this; // for chaining...
    }
})(jQuery);
