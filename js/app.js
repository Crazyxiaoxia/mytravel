var locations = [
    {
        title: '北京',
        des: '我出生的地方-帝都',
        location: {lat: 39.90071, lng: 116.3921}
    }, {
        title: '大连',
        des: '2017-08，我带我妹出去玩耍',
        location: {lat: 38.8803431294, lng: 121.58}
    }, {
        title: '深圳',
        des: '2017-07，临时出差，去了世界公园，华侨城',
        location: {lat: 22.55377, lng: 114.0871167}
    }, {
        title: '张家界',
        des: '2017-10，下一站张家界',
        location: {lat: 28.20035, lng: 112.957560000}
    }
];

var map;
var markers = [];
var filter = [];


function init() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.5796849003, lng: 114.3561655547},
        zoom: 14
    });
    var informationWindow = new google.maps.InfoWindow();
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var des = locations[i].des;
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            des: des,
            title: title,
            animation: google.maps.Animation.DROP
        });
        markers.push(marker);
        marker.addListener('click', function () {
            bounce(this);
            showInfoWindow(this, informationWindow);
        });

    }

    markers.forEach(function (item) {

        var url = "http://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_key="+item.title+"&bk_length=600";

        $.ajax({
            url: url,
            dataType: 'jsonp',
        })
            .done(function(data) {

                    var abstract = data.abstract;
                    item.abstract = "<div>简介: " + abstract + "</div>";

            })
    });

    function bounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function () {
            marker.setAnimation(null);
        }, 2000);
    }


    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);


    function showInfoWindow(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<h3>' + marker.title + '</h3><p>' + marker.des+'</p><div>'+marker.abstract+'</div>');
            infowindow.open(map, marker);
        }
    }
};


var ViewModel = function () {
    var self = this;
    this.locationName = ko.observableArray(locations);
    this.searchText = ko.observable("");
    this.markerItem = ko.observableArray(markers);

    this.search = function (value) {
        self.locationName([]);
        for (var i in locations) {
            if (locations[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.locationName.push(locations[i]);
                markers[i].setVisible(true);
            }
            else markers[i].setVisible(false);
        }
    };
    this.searchText.subscribe(self.search);

    self.select = function () {
        for (i = 0; i < locations.length; i++) {
            filter.push(locations[i].title);
        }
        current = filter.indexOf(this.title);
        google.maps.event.trigger(markers[current], 'click');
    };
};

ko.applyBindings(new ViewModel());