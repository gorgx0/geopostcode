var map;
var markers = new Array();
var geocoder

function findPostalCode(latLng) {
    console.log('find postal code for position')
    $.get(
        'http://api.geonames.org/findNearbyPostalCodesJSON',
        {
            username: 'gorgx0',
            radius: '0.2',
            maxRows: 20,
            lat: latLng.lat(),
            lng: latLng.lng()
        },
        function (data,status,jqXHRobj) {
            console.log('--- geoname results ---');
            console.log(data);
            data.postalCodes.forEach(function (postalCodeItem) {
                console.log(postalCodeItem.postalCode)
            })
            console.log(status);
            console.log(jqXHRobj);
        }
    );
    // http://api.geonames.org/findNearbyPostalCodesJSON?username=gorgx0&lat=52.2304&lng=21.0116&radius=0.1
}

function initMap() {
    geocoder = new google.maps.Geocoder ;
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: {lat: 52.2304, lng: 21.0116},
        zoom: 13,
        draggableCursor: 'pointer'
    });
    map.addListener('click', function (e) {
        console.log('lat: '+e.latLng.lat()+' lng:'+e.latLng.lng());
        var marker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            title: 'a Marker'
        });
        markers.push(marker)
        findPostalCode(e.latLng)
    })
}
