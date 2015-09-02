/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var latitud; //use for work with gmaps
var longitud; //use for work with gmaps
var lat = null; //id input
var lng = null; //id input

var idDivMap = null; //name of id map-canvas
var inputsearch = null; //name of id search
var map = null;
var mMarker = null;
var setIdDivMap = function (idDivMap) {
    this.idDivMap = idDivMap;
};
var setIdInputSearch = function (inputsearch) {
    this.inputsearch = inputsearch;
};
var setIdsLatlng = function (lat, lng) {
    this.lat = document.getElementById(lat);
    this.lng = document.getElementById(lng);
};

var asigLatLng = function (location) {
    if (isNaN(location.lat())) {
        //location SV
        this.latitud = 13.794185;
        this.longitud = -88.89652999999998;
    } else {
        this.lat.value = location.lat();
        this.lng.value = location.lng();
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

var showPosition = function (position) {
    this.latitud = position.coords.latitude;
    this.longitud = position.coords.longitude;
};

var displayError = function (error) {
    var errors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
    };
    alert("Error: " + errors[error.code]);
};

//get current position from navigator
var getGeoLocation = function () {
    if (navigator.geolocation) {
        var timeoutVal = 10 * 1000 * 1000;
        navigator.geolocation.getCurrentPosition(
            showPosition,
            displayError,
            { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
        );
    } else {
        alert("Geolocation is not supported by this browser");
    }
};

// initialize GMaps
function GmapsInit() {
    var comparethis = lat.value;
    var marker = null;
    var pos = null;

    if (comparethis !== "") {
        latitud = parseFloat(lat.value);
        longitud = parseFloat(lng.value);
    }
    pos = new google.maps.LatLng(latitud, longitud);
    asigLatLng(pos);

    var mapOptions = {
        zoom: 17,
        center: new google.maps.LatLng(latitud, longitud),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    var mapDiv = document.getElementById(idDivMap);
    map = new google.maps.Map(mapDiv, mapOptions);
    marker = placeMarker(pos, map, null);

    var input = (document.getElementById(inputsearch));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox((input));
    google.maps.event.addListener(searchBox, 'places_changed', function () {

        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            placeMarker(place.geometry.location, map, marker);
            asigLatLng(place.geometry.location);
            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
        map.setZoom(17);
    });

    google.maps.event.addListener(map, 'bounds_changed', function () {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });
    google.maps.event.addListener(map, 'click', function (event) {
        placeMarker(event.latLng, map, marker);
        asigLatLng(event.latLng);
    });
    google.maps.event.addListener(marker, 'drag', function (event) {
        asigLatLng(event.latLng);
    });
    google.maps.event.addListener(marker, 'dragend', function (event) {
        asigLatLng(event.latLng);
    });
}