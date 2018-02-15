var map;
var markers = new Array();
function recalculatePostalCodesList() {
    var postCodes = new Array()
    console.log('--- recalculatePostalCodesList ---')
    markers.forEach(function (markerStructure) {
        console.log(markerStructure.postCodes)
        markerStructure.postCodes.forEach(function (postalCode) {
            if(!_.contains(postCodes, postalCode)){
                postCodes.push(postalCode)
            }
        })
    })
    $('#codesListContainerList').empty()
    postCodes.forEach(function (postCode) {
        $('#codesListContainerList').append('<li>'+postCode+'</li>')
    })
}

function findPostalCode(markerStructure) {
    console.log('find postal code for position')
    radius = parseInt($('#radiusInput').val());
    $.get(
        'http://api.geonames.org/findNearbyPostalCodesJSON',
        {
            username: 'gorgx0',
            radius: radius/1000 ,
            maxRows: 20,
            lat: markerStructure.marker.position.lat(),
            lng: markerStructure.marker.position.lng()
        },
        function (data,status,jqXHRobj) {
            console.log('--- geoname results ---');
            console.log(data);
            data.postalCodes.forEach(function (postalCodeItem) {
                console.log(postalCodeItem.postalCode)
                markerStructure.postCodes.push(postalCodeItem.postalCode)
            })
            console.log(status);
            console.log(jqXHRobj);
            recalculatePostalCodesList()
        }
);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: {lat: 52.2304, lng: 21.0116},
        zoom: 13,
        draggableCursor: 'pointer'
    });
    map.addListener('click', function (e) {
        var marker = new google.maps.Marker({
            position: e.latLng,
            map: map,
            title: 'r='+$('#radiusInput').val()+' m'
        });
        marker.addListener("click", function (e) {
            console.log("Marker clicked: ")
            markers = _.reject(markers, function (markerStructure) {
                let same = markerStructure.marker.getPosition().equals(marker.getPosition());
                return same;
            });
            this.setMap(null)
            recalculatePostalCodesList();
        })

        var markerStructure = {
            marker: marker,
            radius: $('#radiusInput').val(),
            postCodes : new Array()
        }
        markers.push(markerStructure)
        findPostalCode(markerStructure)
    })
}

$(function () {
    $('#radiusInput').keyup(function (e) {
        radiusVal = $('#radiusInput').val()
        radius = Number(radiusVal)
        if(isNaN(radius)) {
            $('#radiusInput').addClass('validationError')
        }else{
            $('#radiusInput').removeClass('validationError')
        }
    });

})