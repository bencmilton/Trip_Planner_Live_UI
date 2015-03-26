$(document).ready(function(){


// Add hotels, restaurants, and things to itinerary //

	$('#pick_me').on('click', 'button', function () {
		$button = $(this);
		$select = $button.siblings('select');
		$type = $button.siblings('h4');

		if ($type.text() === 'Hotels'){

			if ($("#hotels-list span").length === 1){
				$('#hotels-list div').remove()
			};
			$('#hotels-list').append('<div class="itinerary-item"><span class="title">'+$select.val()+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
			
		}

		if ($type.text() === 'Restaurants'){
			if ($("#restaurants-list span").text().indexOf($select.val()) > -1 ){
				return;
			} else {
				$('#restaurants-list').append('<div class="itinerary-item"><span class="title">'+$select.val()+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
			}
		}

		if ($type.text() === 'Things To Do'){
			if ($("#things-list span").text().indexOf($select.val()) > -1 ){
				return;
			} else {
				$('#things-list').append('<div class="itinerary-item"><span class="title">'+$select.val()+'</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>');
			}
		}

		initialize_gmaps(populate_locations());				
	});

// Remove hotels, restaurants, and things to itinerary

	$('#itinerary').on('click', 'button', function () {
		$button = $(this);
		$div = $button.parent('div');

		$div.remove();

		initialize_gmaps(populate_locations());

	});	

    initialize_gmaps(populate_locations());

});

function populate_locations(){
	//console.log(all_restaurants);

    var hotelLocation = "";
    var restaurantLocations = [];
    var thingToDoLocations = [];

$("#hotels-list span").each(function(index, element){
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
	
	
$("#restaurants-list span").each(function(index, element){
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

$("#things-list span").each(function(index, element){
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
        var myLatlng = new google.maps.LatLng(40.705189,-74.009209);
        // set the map options hash
        var mapOptions = {
          center: myLatlng,
          zoom: 13,
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

        function drawLocation (location, opts) {
          if (typeof opts !== 'object') opts = {};
          opts.position = new google.maps.LatLng(location[0], location[1]);
          opts.map = map;
          var marker = new google.maps.Marker(opts);
        }
        drawLocation(hotelLocation, {
          icon: '/images/lodging_0star.png'
        });
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
      }

      // $(document).ready(function() {
      //   initialize_gmaps();
      // });

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










 