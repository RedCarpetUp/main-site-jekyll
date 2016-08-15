(function($){
   $.fn.slideControl = function(options) {
    
    // defaults
    var defaults = {
      speed: 200,
      lowerBound: 1,
      upperBound: 10,
      increment: 1
    };

    var options = $.extend(defaults, options);
    
    return this.each(function() {
      
      // set vars
      var lowerBound = parseInt(options.lowerBound);
      var upperBound = parseInt(options.upperBound);
      var speed = parseInt(options.speed);
      var increment = parseInt(options.increment);
      var controller = false;
      var position = 0;
      var obj = this;
      var total = upperBound - lowerBound;
      var getVal = function(percentage){ return Math.round((total * percentage / 100 + lowerBound) / increment) * increment; }
      var animate = function(value){ $(fill).css({width: value + "%"}); }
      var getPosition = function(e) { return checkBoundaries(Math.round(((e.pageX - offsetLeft) / containerWidth) * 100)); }
      var update = function(position){
        animate(Math.round(position + handleHalfWidth * 100 / containerWidth));
        $(input).val(getVal(position));
        updateLoan();
      }
      $(this).addClass('slide-control-input');
      var parent = $(this).parent();
      var label = $(parent).find('label');
      var width = Math.round(($(obj).val() - lowerBound) * 100 / total);
      var html = "<label class=\"control-label\">" + $(label).html() + "</label>"
      var unit = $(obj).data('unit');
      if (unit && unit == '₹') { html += "<label class=\"unit-label\">" + unit + "</label>" }
      html += $(obj).wrap("<span></span>").parent().html();
      html += "<span class=\"slide-control-container\"><span class=\"slide-control-fill bg-grad\" style=\"width:" + width + "%\">";
      html += "<span class=\"slide-control-handle\"></span></span>";
      html += "<span class=\"slide-control-range range-min\">" + lowerBound + "</span>";
      html += "<span class=\"slide-control-range range-max\">" + upperBound + "</span>"
      html += "</span>";
      if (unit && unit != '₹') { html += "<label class=\"unit-label\">" + unit + "</label>" }
      parent.html(html);
      var container = parent.find('.slide-control-container');
      var fill = container.find('.slide-control-fill');
      var handle = fill.find('.slide-control-handle');
      var input = parent.find('input');
      var containerWidth = container.outerWidth() + 1;
      var handleHalfWidth = $(handle).outerWidth() / 2;
      var offsetLeft = $(container).offset().left;
      
      $(window).resize(function() {
        offsetLeft = $(container).offset().left;
      })
      
      //adds shadow class to handle for IE <9
      if (getInternetExplorerVersion() < 9 && getInternetExplorerVersion() > -1) {
        handle.addClass('ie-shadow');
      }
      
      // when user clicks anywhere on the slider
      $(container).click(function(e) {    
        e.preventDefault();
        update(getPosition(e));
      });
      
      // when user clicks handle
      $(handle).mousedown(function(e) {
        e.preventDefault();
        controller = true;
        $(document).mousemove(function(e) {
          e.preventDefault();
          if (controller) { 
            update(getPosition(e));
          }
        });
        $(document).mouseup(function() {
          e.preventDefault();
          controller = false;
        });
      });
      
      // when user changes value in input
      // $(input).change(function() {
      //   var value = checkBoundaries($(this).val()*factor);
      //   if ($(this).val() > upperBound)
      //     $(input).val(upperBound);
      //   else if ($(this).val() < lowerBound)
      //     $(input).val(lowerBound);
      //   animate(value);
      // });
    });
    
    // checks if value is within boundaries
    function checkBoundaries(value) {
      if (value < 0)
        return 0;
      else if (value > 100)
        return 100;
      else
        return value;
    }
    
    // checks ie version
    function getInternetExplorerVersion(){
       var rv = -1;
       if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
         rv = parseFloat( RegExp.$1 );
       }
       return rv;
    }
    return this;
   }
})(jQuery);
