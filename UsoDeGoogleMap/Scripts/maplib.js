var id_lat;
var id_lng;
var latitud;
var longitud;

var LatLng = {
    lat: 13.794185,
    lng: -88.89652999999998
};

var canvas_map;
var name_canvas;
var inputSearch;
var name_input_search;

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

var setCanvasMap = function (id_canvas) {
    name_canvas = id_canvas;
    canvas_map = document.getElementById(id_canvas);
};

var setLatLng = function (id_lat, id_lng) {
    this.id_lat = id_lat;
    this.id_lng = id_lng;

    this.latitud = document.getElementById(id_lat);
    this.longitud = document.getElementById(id_lng);
};

var setInputSearch = function (id_input_search) {
    this.name_input_search = id_input_search;
    this.inputsearch = document.getElementById(id_input_search);
}

var showPosition = function (position) {
    latitud.value = position.coords.latitude;
    longitud.value = position.coords.longitude;

    LatLng.lat = position.coords.latitude;
    LatLng.lng = position.coords.longitude;

    //var latlon = position.coords.latitude + "," + position.coords.longitude;
    //var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="
    //+latlon+"&zoom=14&size=400x300&sensor=false";
    //canvas_map.innerHTML = "<img src='"+img_url+"'>";
};

var onError = function (error) {
    var errors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
    };
    latitud.value = this.LatLng.lat;
    longitud.value = this.LatLng.lng;
    alert("Error: " + errors[error.code]);
};

//get current position from navigator
var getGeoLocation = function () {
    if (navigator.geolocation) {
        var timeoutVal = 10 * 1000 * 1000;
        navigator.geolocation.getCurrentPosition(
            showPosition,
            onError,
            { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
        );
    } else {
        alert("Geolocation is not supported by this browser");
    }
};

//marker on map
var placeMarker = function (location, map, marker) {
    if (marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true,
        });
        marker.addListener('click', toggleBounce);
    }
    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
    return marker;
}

var initGMap = function () {
    var marker;
    var mapOptions = {
        zoom: 17,
        center: this.LatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map(canvas_map, mapOptions);
    marker = placeMarker(LatLng, map, null);
    map.addListener('center_changed', function () {
        console.log("centrando mapa");
        console.log(LatLng);
    });
    google.maps.event.addListenerOnce(map, 'idle', function () {
        // do something only the first time the map is loaded
        console.log("termino de cargar");
        map.panTo(LatLng);
        placeMarker(LatLng, map, marker);
    });
    google.maps.event.addListener(marker, 'drag', function (event) {
        newLatLng(event.latLng);
    });
    google.maps.event.addListener(marker, 'dragend', function (event) {
        newLatLng(event.latLng);
        map.panTo(LatLng);
    });


    var fx = google.maps.InfoWindow.prototype.setPosition;

    //override the built-in setPosition-method
    google.maps.InfoWindow.prototype.setPosition = function () {

        //this property isn't documented, but as it seems
        //it's only defined for InfoWindows opened on POI's
        if (this.logAsInternal) {
            google.maps.event.addListenerOnce(map, 'map_changed', function () {
                var map = this.getMap();
                //the infoWindow will be opened, usually after a click on a POI
                if (map) {
                    //trigger the click
                    google.maps.event.trigger(map, 'click', { latLng: this.getPosition() });
                }
            });
        }
        //call the original setPosition-method
        fx.apply(this, arguments);
    };

    google.maps.event.addListener(map, 'click', function (e) {
        //alert('clicked @' + e.latLng.toString())
        console.log(e.latLng);
        //newLatLng(e);
        marker.setMap(null);
        var start = LatLng;
        var end = e.latLng;

        var directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
        directionsDisplay.setMap(map); // map should be already initialized.

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    })

}

var newLatLng = function (location) {
    LatLng.lat = location.lat();
    LatLng.lng = location.lng();

    latitud.value = location.lat();
    longitud.value = location.lng();
}
function initMap(callbackGeo, callbackGMap) {
    callbackGeo();
    callbackGMap();
}
var getGoogleMap = function () {
    google.maps.event.addDomListener(window, 'load', initGMap);
}
var resizeBootstrapMap = function (content_map) {
    var content = document.getElementById(content_map);
    var w = content.offsetWidth;
    canvas_map.style.width = w+"px";
    canvas_map.style.height = (3 * w / 4)+"px";
    google.maps.event.trigger(canvas_map, 'resize');
};