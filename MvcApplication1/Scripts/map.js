
var geocoder;
var map;
var markers = [];
var probcodeList = [];
var severityList = [];

function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(42.27, -89.08);
    var mapOptions = {
        zoom: 12,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    function setAllMap(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    function deleteMarkers() {
        setAllMap(null);
        markers = [];
    }
}

function populateData() {

    deleteMarkers();
    var probcode = document.getElementById('probcode').value;

    if (probcode) {
        $.ajax({
            url: 'https://data.illinois.gov/api/views/53fr-di76/rows.json?accessType=DOWNLOAD',
            type: 'get',
            cache: false,
            timeout: 30000,
            success: function (data) {
                //alert(data.data.length);
                for (var i = 0; i < data.data.length; i++) {
                    var address = data.data[i][15];
                    var info = getInfo(data.data[i]);
                    if (probcodeList.indexOf(data.data[i][10]) == -1) {
                        $('#probcode').append($('<option>').text(data.data[i][11]).attr('value', data.data[i][10]));
                    }
                    probcodeList.push(data.data[i][10]);
                    if (probcode == data.data[i][10] || probcode == 'ALL') {
                        codeAddress(address, info);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //console.log(xhr.responseText);
            }
        });
    } else {
        deleteMarkers();
    }
}

function populateServiceData() {

    deleteMarkers();
    var severity = document.getElementById('severity').value;

    $.ajax({
        url: '/api/ServiceRequest',
        type: 'get',
        cache: false,
        timeout: 30000,
        success: function (data) {
            for (var i = 0; i < data.length; i++) {                                            

                if (severityList.indexOf(data[i].Severity) == -1) {
                    $('#severity').append($('<option>').text(data[i].Severity).attr('value', data[i].Severity));
                }
                severityList.push(data[i].Severity);
                if (severity == data[i].Severity || severity == 'ALL') {

                    var myLatlng = new google.maps.LatLng(data[i].Latitude, data[i].Longitude);
                    var info = getImage(data[i]);

                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map
                    });

                    var infowindow = new google.maps.InfoWindow({
                        content: info
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}

function testPost() {
    $.ajax({
        url: '/api/ServiceRequest',
        data: { "ID": "BCDFB087-7D4A-469A-ACC3-93987208091X", "ImageUrl": "http://media.nj.com/ledgerlocal/photo/light2jpg-7244910bbbfd6bce_large.jpg", "UserID": "sanish", "Latitude": 42.27, "Longitude": -89.08, "Description": "Test", "Severity": "High", "ServiceType": "Type1" },
        type: 'post',
        cache: false,
        timeout: 30000,
        success: function (data) {
            alert("success");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}

function codeAddress(address, info) {
    if (address == undefined) {
        var address = document.getElementById('address').value;
        var info = address;
    }
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
                    
            map.setCenter(results[0].geometry.location);

            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

            markers.push(marker);

            var infowindow = new google.maps.InfoWindow({
                content: info
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });

        } else {
            //alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function deleteMarkers() {
    setAllMap(null);
    markers = [];
}

google.maps.event.addDomListener(window, 'load', initialize);

function getInfo(data) {

    var contentString = '<div>' +          
    '<p> Service No: <b>' + data[8] + '</b></p>' +
    '<p> Requested Date: <b>' + data[9] + '</b></p>' +
    '<p> Prob Code: <b>' + data[10] + '</b></p>' +
    '<p> Prob Desc: <b>' + data[11] + '</b></p>' +
    '<p> Assigned: <b>' + data[12] + '</b></p>' +
    '<p> Location: <b>' + data[13] + '</b></p>' +
    '<p> Address 1: <b>' + data[15] + '</b></p>' +
    '</div>';
            
    return contentString;
}

function getImage(data) {

    var contentString = '<div>' +
    '<p> Description: <b>' + data.Description + '</b></p>' +
    '<p> Severity: <b>' + data.Severity + '</b></p>' +
    '<p> Created Date: <b>' + data.CreatedDate + '</b></p>' +
    '<p><img src="'+data.ImageUrl+'" alt=""> </p>' +
    '</div>';

    return contentString;
}