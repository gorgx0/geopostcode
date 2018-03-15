var map;
var markers = new Array();

function recalculatePostalCodesList() {
    var postCodes = new Array();
    console.log('--- recalculatePostalCodesList ---');
    markers.forEach(function (markerStructure) {
        console.log(markerStructure.postCodes);
        markerStructure.postCodes.forEach(function (postalCode) {
            if(!_.contains(postCodes, postalCode)){
                postCodes.push(postalCode)
            }
        })
    });
    $('#codesListContainerList').empty();
    postCodes.sort();
    postCodes.forEach(function (postCode) {
        $('#codesListContainerList').append('<li>'+postCode+'</li>')
    })
}

function removeMarkerByCircle(circle) {
    markers = _.reject(markers, function (markerStructure) {
        return  markerStructure.markerCircle.getCenter().equals(circle.getCenter());
    });
}

function findPostalCode(markerStructure) {
    console.log('find postal code for position');
    radius = markerStructure.markerCircle.radius;
    $.get(
        'https://secure.geonames.org/findNearbyPostalCodesJSON',
        {
            username: 'gorgx0',
            radius: radius/1000 ,
            maxRows: 20,
            lat: markerStructure.markerCircle.getCenter().lat(),
            lng: markerStructure.markerCircle.getCenter().lng()
        },
        function (data,status,jqXHRobj) {
            console.log('--- geoname results ---');
            console.log(data);
            data.postalCodes.forEach(function (postalCodeItem) {
                console.log(postalCodeItem.postalCode);
                markerStructure.postCodes.push(postalCodeItem.postalCode)
            });
            console.log(status);
            console.log(jqXHRobj);
            recalculatePostalCodesList()
        }
);
}

// noinspection JSUnusedGlobalSymbols
function initMap() {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: {lat: 52.2304, lng: 21.0116},
        zoom: 13,
        draggableCursor: 'pointer'
    });
    map.addListener('click', function (e) {
        var markerCircle = new google.maps.Circle({
            map:map,
            center: e.latLng,
            radius: parseInt($('#radiusInput').val()),
            draggable:true,
            editable: true,
            fillColor: '#BC79B6',
            strokeWeight: 1,
            strokeColor: '#895883'
        });

        markerCircle.addListener('click',function () {
            removeMarkerByCircle(markerCircle);
            markerCircle.setMap(null);
            recalculatePostalCodesList();
        });


        markerCircle.addListener('dragstart',function () {
            removeMarkerByCircle(markerCircle)
        });

        markerCircle.addListener('dragend', function () {
            var markerStructure = {
                markerCircle: markerCircle,
                postCodes : new Array()
            };
            markers.push(markerStructure);
            markerStructure.postCodes = [];
            findPostalCode(markerStructure);
            recalculatePostalCodesList();
        });

        markerCircle.addListener('radius_changed',function () {
            markerStructure = _.find(markers, function (i) {
                return i.markerCircle.center.equals(markerCircle.center);
            });
            markerStructure.postCodes = [];
            findPostalCode(markerStructure);
            recalculatePostalCodesList();
        })

        var markerStructure = {
            markerCircle: markerCircle,
            postCodes : new Array()
        };
        markers.push(markerStructure);
        findPostalCode(markerStructure);
        recalculatePostalCodesList();
    })
}

$(function () {
    $('#radiusInput').keyup(function () {
        radiusVal = $('#radiusInput').val();
        radius = Number(radiusVal);
        if(isNaN(radius)) {
            $('#radiusInput').addClass('validationError');
        }else{
            $('#radiusInput').removeClass('validationError');
        }
    });

});
