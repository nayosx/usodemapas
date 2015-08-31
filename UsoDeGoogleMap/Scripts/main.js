//var button = document.createElement('button');
//var textNode = document.createTextNode('Click Me!');
//button.appendChild(textNode);
//button.className = 'mdl-button mdl-js-button mdl-js-ripple-effect';
//componentHandler.upgradeElement(button);
//document.getElementById('container').appendChild(button);

var resizeMap = function (containerId, map_canvas) {
    var mapParentWidth = $('#'+containerId).width();
    map_canvas.width(mapParentWidth);
    map_canvas.height(3 * mapParentWidth / 4);
    google.maps.event.trigger(map_canvas, 'resize');
};