/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a:not(.dropdown-toggle)').click(function() {
    $('.navbar-toggle:visible').click();
});

$(function() {
  var stage = new createjs.Stage("viewport");

  base_image = new Image();
  base_image.src = 'img/map/map.png';

  base_image.onload = function(){
    var bitmap = new createjs.Bitmap(base_image);
    stage.enableMouseOver(10);
    stage.addChild(bitmap);
    bitmap.addEventListener("click", function(event) {
       $(".myObj").popover('hide');
    });

    marker = new Image();
    marker.src = 'img/map/marker.png';

    marker.onload = function(){
      var bitmap_marker = [];
      $.getJSON("http://vicsurv.cloudapp.net:5780/api/get_daily_levels", function( data ) {
        $.each(data, function(i, item) {
          bitmap_marker[i] = new createjs.Bitmap(marker);
          bitmap_marker[i].alpha = 0.5;
          bitmap_marker[i].x = item.x - 25;
          bitmap_marker[i].y = item.y - 25;
          bitmap_marker[i].on("mouseover", handleInteraction);
          bitmap_marker[i].on("mouseout", handleInteraction);
          bitmap_marker[i].addEventListener("click", function(event) {
            ni = (item.ni_p50/13.4*100).toFixed(1);
            ox = (item.ox_p50/11*100).toFixed(1);
            ph = (item.ph_p50/2.4*100).toFixed(1);
            ts = (item.ts_p50/47*100).toFixed(1);
            content = "<p>" + item.region + "</p>Nitrogen: " + ni + "%<br/>Oxygen: " + ox + "%<br/>Phosphorus: " + ph + "%<br/>Total suspended solids: " + ts + "%"
            $(".myObj").attr('data-content', content);
            $(".myObj").attr('data-original-title', item.area);
            $(".myObj").css({'position':'absolute','top':item.y,'left':item.x + 15}).popover({
                html : true,
                trigger: 'click',
                placement:'top'
            }).popover('show');
          });
          stage.addChild(bitmap_marker[i]);
        });

        stage.update();
        createjs.Ticker.addEventListener("tick", stage);
      });
    };
  };

  function handleInteraction(event) {
    event.target.alpha = (event.type == "mouseover") ? 1 : 0.5; 
  }
});