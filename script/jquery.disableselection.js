
(function($){
    $.fn.extend({ 
        disableSelection: function() { 
            this.each(function() { 
                if (typeof this.onselectstart != 'undefined') {
                    this.onselectstart = function() { return false; };
                } else if (typeof this.style.MozUserSelect != 'undefined') {
                    this.style.MozUserSelect = 'none';
                } else {
                    this.onmousedown = function() { return false; };
                }
            }); 
        } 
    });
})($);
