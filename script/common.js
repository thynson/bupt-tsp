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

    // Disable Text Selection on label and legend tags
    $("label,.legend").disableSelection();

})($);
