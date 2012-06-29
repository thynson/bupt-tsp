;(function($){

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
		form.submit(function(e){
			try {
				callback();
			} catch(err) {
			}
			e.preventDefault();
		});
	};
})($);
