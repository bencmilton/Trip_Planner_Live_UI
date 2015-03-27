$(document).ready(function(){


// Add hotels, restaurants, and things to itinerary //

	$('#pick_me').on('click', 'button', function () {
		$button = $(this);
		$select = $button.siblings('select');
		$type = $button.siblings('h4');

		if ($type.text() === 'Hotels'){

			if ($(".itinerary.current-day #hotels-list span").length === 1){
				$('.itinerary.current-day #hotels-list div').remove()
			};
			$('.itinerary.current-day #hotels-list').append('<div class="itinerary-item"><span class="title">'+$select.val()+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
			
		}

		if ($type.text() === 'Restaurants'){
			if ($(".itinerary.current-day #restaurants-list span").text().indexOf($select.val()) > -1 ){
				return;
			} else {
				$('.itinerary.current-day #restaurants-list').append('<div class="itinerary-item"><span class="title">'+$select.val()+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
			}
		}

		if ($type.text() === 'Things To Do'){
			if ($(".itinerary.current-day #things-list span").text().indexOf($select.val()) > -1 ){
				return;
			} else {
				console.log($(".itinerary.current-day #things-list span").text());
				$('.itinerary.current-day #things-list').append('<div class="itinerary-item"><span class="title">'+$select.val()+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
			}
		}

		initialize_gmaps(populate_locations());				
	});

// Remove hotels, restaurants, and things to itinerary

	$('#itin_body').on('click', 'button', function () {

		$button = $(this);
		$div = $button.parent('div');

		$div.remove();

		initialize_gmaps(populate_locations());

	});	

// Add-a-day button

	$("#add-day-btn").on('click', function(){
		$dayLength = $('.day-buttons button').length;	

		$(body_clone).appendTo('#itin_body');

		$('<button class="btn btn-circle day-btn">'+$dayLength+'</button>').insertAfter(".day-buttons button:nth-last-child(2)");
		$(".day-buttons button:nth-last-child(2)").trigger("click");

	});

// Switch day

	$(".day-buttons").on("click", "button", function(){
		$button = $(this);
		if(!$button.is("#add-day-btn")){
			
			//change colors
			$(".day-buttons").find("button.current-day").removeClass("current-day");
			$button.addClass("current-day");
			$current = $("button.current-day").text();
			$('#day-title span').text('Day '+ $current);
			
			//hides prev current day
			$("div.current-day").removeClass("current-day").toggle();

			//shows the new current day
			$("#itin_body .itinerary:nth-child("+ $current + ")").addClass("current-day").toggle();

			initialize_gmaps(populate_locations());

		}

	});

// Delete day
	$('#day-title button').on('click', function () {
		if ($(".day-buttons button").length === 2){
			$('.itinerary.current-day').remove();
			$(body_clone).appendTo('#itin_body');
			initialize_gmaps(populate_locations());
			return;
		}

		$('.itinerary.current-day').remove();
		$(".day-buttons button:nth-last-child(2)").remove();
		$(".day-buttons button").prev().trigger("click");


	});	

    initialize_gmaps(populate_locations());

});


function populate_locations(){

    var hotelLocation = "";
    var restaurantLocations = [];
    var thingToDoLocations = [];

	$(".itinerary.current-day #hotels-list span").each(function(index, element){
		hotelLocation = $(this).text();
	});
	
	if (hotelLocation !== ""){
		hotelLocation = all_hotels.filter(function(elObj){
			if(elObj.name == hotelLocation){
				return true;
			}
			return false;
		})[0].place[0].location;
	}
		
		
	$(".itinerary.current-day #restaurants-list span").each(function(index, element){
		restaurantLocations.push( $(this).text() );
	});
		
		restaurantLocations = restaurantLocations.map(function(el){
				return all_restaurants.filter(function(elObj){
					if(elObj.name == el){
						return true;
					}
					return false;
				})[0].place[0].location;
		});

	$(".itinerary.current-day #things-list span").each(function(index, element){
		thingToDoLocations.push( $(this).text() );
	});
		
		thingToDoLocations = thingToDoLocations.map(function(el){
				return all_things_to_do.filter(function(elObj){
					if(elObj.name == el){
						return true;
					}
					return false;
				})[0].place[0].location;
		});

	return [hotelLocation, restaurantLocations, thingToDoLocations]

};


function initialize_gmaps(arr) {
		var hotelLocation = arr[0]; 
		var restaurantLocations = arr[1]; 
		var thingToDoLocations = arr[2];

        // initialize new google maps LatLng object
        var myLatlng = new google.maps.LatLng(40.718613,-74.000806);
        // set the map options hash
        var mapOptions = {
          center: myLatlng,
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: styleArr
        };
        // get the maps div's HTML obj
        var map_canvas_obj = document.getElementById("map-canvas");
        // initialize a new Google Map with the options
        var map = new google.maps.Map(map_canvas_obj, mapOptions);
        // Add the marker to the map
        var marker = new google.maps.Marker({
          position: myLatlng,
          title:"Hello World!"
        });

        var bounds = new google.maps.LatLngBounds();

        function drawLocation (location, opts) {
          if (typeof opts !== 'object') opts = {};
          opts.position = new google.maps.LatLng(location[0], location[1]);
          opts.map = map;
          var marker = new google.maps.Marker(opts);
          
          bounds.extend(opts.position);
          
        }
		

    // Check for weird empty hotel array bug
        if (hotelLocation !== ""){
	        drawLocation(hotelLocation, {
	          icon: '/images/lodging_0star.png'
	        });       	
        }
        
        restaurantLocations.forEach(function (loc) {
          drawLocation(loc, {
            icon: '/images/restaurant.png'
          });
        });
        thingToDoLocations.forEach(function (loc) {
          drawLocation(loc, {
            icon: '/images/star-3.png'
          });
        });

	// If all any points have been added, use the fitBounds method, otherwise, draw default blank, map
        if (hotelLocation.length !== 0 || restaurantLocations.length !==0 || thingToDoLocations.length !== 0){
        	map.fitBounds(bounds);
        }
      }

      var styleArr = [
        {
          'featureType': 'landscape',
          'stylers': [
            { 'saturation': -100 },
            { 'lightness': 60 }
          ]
        },
        {
          'featureType': 'road.local',
          'stylers': [
            { 'saturation': -100 },
            { 'lightness': 40 },
            { 'visibility': 'on' }
          ]
        },
        {
          'featureType': 'transit',
          'stylers': [
            { 'saturation': -100 },
            { 'visibility': 'simplified' }
          ]
        },
        {
          'featureType': 'administrative.province',
          'stylers': [
            { 'visibility': 'off' }
          ]
        },
        {
          'featureType': 'water',
          'stylers': [
            { 'visibility': 'on' },
            { 'lightness': 30 }
          ]
        },
        {
          'featureType': 'road.highway',
          'elementType': 'geometry.fill',
          'stylers': [
            { 'color': '#ef8c25' },
            { 'lightness': 40 }
          ]
        },
        {
          'featureType': 'road.highway',
          'elementType': 'geometry.stroke',
          'stylers': [
            { 'visibility': 'off' }
          ]
        },
        {
          'featureType': 'poi.park',
          'elementType': 'geometry.fill',
          'stylers': [
              { 'color': '#b6c54c' },
              { 'lightness': 40 },
              { 'saturation': -40 }
          ]
        }
      ];

var body_clone = '<div class="itinerary current-day"><div><h4>My Hotel</h4><ul id="hotels-list" class="list-group"></ul></div><div><h4>My Restaurants</h4><ul id="restaurants-list" class="list-group"></ul></div><div><h4>My Things To Do</h4><ul id="things-list" class="list-group"></ul></div></div>';









 