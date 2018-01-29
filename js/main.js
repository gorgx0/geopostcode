var map;
function initMap() {
map = new google.maps.Map(document.getElementById('map_canvas'), {
  center: new google.maps.LatLng(51.5, -0.2),
  zoom: 8
});
}