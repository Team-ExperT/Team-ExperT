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

// Map handler
$(function() {
  var stage = new createjs.Stage("viewport");

  base_image = new Image();
  base_image.src = 'img/map/map.png';

  base_image.onload = function(){
    // Draw stage/background
    var bitmap = new createjs.Bitmap(base_image);
    stage.enableMouseOver(10);
    stage.addChild(bitmap);
    stage.update();

    // Clear map when clicked
    bitmap.addEventListener("click", function(event) {
       $(".myObj").popover('hide');
    });

    // Prepare marker
    marker = new Image();
    marker.src = 'img/map/marker.png';

    marker.onload = function(){
      var bitmap_marker = [];
      $.getJSON("http://vicsurv.cloudapp.net:5780/api/get_daily_levels", function( data ) {
        $.each(data, function(i, item) {
          bitmap_marker[i] = new createjs.Bitmap(marker);

          // Marker position
          bitmap_marker[i].x = item.x - 25;
          bitmap_marker[i].y = item.y - 25;

          // Animating marker on hover
          bitmap_marker[i].alpha = 0.5;
          bitmap_marker[i].on("mouseover", handleInteraction);
          bitmap_marker[i].on("mouseout", handleInteraction);

          // On click listener on marker
          bitmap_marker[i].addEventListener("click", function(event) {

            // Set popover content
            content = "<p>" + item.region + "</p>Nitrogen: " + display_percentage('ni', item.ni_p50) + "%<br/>"
              + "Oxygen: " + display_percentage('ox', item.ox_p50) + "%<br/>"
              + "Phosphorus: " + display_percentage('ph', item.ph_p50) + "%<br/>"
              + "Total suspended solids: " + display_percentage('ts', item.ts_p50) + "%"
            $(".myObj").attr('data-content', content);
            $(".myObj").attr('data-original-title', item.area);

            // Build the popover
            $(".myObj").css({'position':'absolute','top':item.y,'left':item.x + 15}).popover({
                html : true,
                trigger: 'click',
                placement:'top'
            }).popover('show');
          });

          // Add the marker to the stage
          stage.addChild(bitmap_marker[i]);
        });

        // Draw the stage
        stage.update();
        createjs.Ticker.addEventListener("tick", stage);
      });
    };
  };

  // Hover handler
  function handleInteraction(event) {
    event.target.alpha = (event.type == "mouseover") ? 1 : 0.5; 
  }
});

// Localization handler
$(function() {
  $('#localization-button').click(function(){
    pcode = $('#localization-input').val();
    $.getJSON("http://vicsurv.cloudapp.net:5780/api/get_closest_catchment/"+pcode, function( data ) {
      data = data[0];
      result = '<div class="alert alert-info"><dl class="dl-horizontal">'
        + '<dt>Catchment</dt><dd>' + data.area + '</dd>'
        + '<dt>Site</dt><dd>' + data.region + '</dd>'
        + '<dt>Nitrogen</dt><dd>' + data.ni_p50 + ' mg/L (' + display_percentage('ni', data.ni_p50) + '%)</dd>'
        + '<dt>Oxygen</dt><dd>' + data.ox_p50 + ' mg/L ((' + display_percentage('ox', data.ox_p50) + '%)</dd>'
        + '<dt>Phosphorus</dt><dd>' + data.ph_p50 + ' mg/L (' + display_percentage('ph', data.ph_p50) + '%)</dd>'
        + '<dt>Total suspended solids</dt><dd>' + data.ts_p50 + ' mg/L (' + display_percentage('ts', data.ts_p50) + '%)</dd>'
        + '</dl><footer><small>* Data taken as per latest measurement.<br />** Percentage indicates comparison with highest value measured.</small></footer>'
        + '</div>';
      $('#localization-result').html(result).show('slow');
    });
  });
});

function display_percentage(type, num){
  switch(type){
    case 'ni':
      return (num/13.4*100).toFixed(1);
      break;
    case 'ox':
      return (num/11*100).toFixed(1);
      break;
    case 'ph':
      return (num/2.4*100).toFixed(1);
      break;
    case 'ts':
      return (num/47*100).toFixed(1);
      break;
  } 
}