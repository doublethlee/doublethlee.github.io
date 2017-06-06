$.fn.extend({
    animateCss: function (animationName,infinite) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        if(!infinite)
        {
            this.addClass('animated ' + animationName).one(animationEnd, function() {
              $(this).removeClass('animated ' + animationName);
            });
        }
        else
        {
            this.addClass('animated ' + animationName);
            this.addClass('infinite');
        }
    }
    ,
    StopCss:function(animationName){
        $(this).removeClass('infinite');
        $(this).removeClass('animated ' + animationName);
    }
});