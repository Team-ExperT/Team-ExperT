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
    var canvas = document.getElementById('viewport');
    canvas.width  = 640;
    canvas.height = 640;
    context = canvas.getContext('2d');

    draw_base();

    function draw_base()
    {
      base_image = new Image();
      base_image.src = 'img/map/map.png';

        marker_image = new Image();
        marker_image.src = 'img/map/marker.png';

      base_image.onload = function(){
        context.drawImage(base_image, 0, 0);

        $.getJSON("http://vicsurv.cloudapp.net:5780/api/get_daily_levels", function( data ) {
            $.each(data, function(i, item) {
                draw_marker(marker_image, item.x - 25 , item.y - 25);
            });
        });
      }
    }

    function draw_marker(marker_image, x, y)
    {
        context.drawImage(marker_image, x, y);
    }
});