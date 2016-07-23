// MapMarkerSet class contains information of map markers for searching.
var MapMarkerSet = function(marker, name, category, position) {
    this.marker = marker,
    this.name = name,
    this.category = category,
    this.position = position
};
firstLS900 = true;
// View Model of the app.
function MapViewModel() {
    var self = this,
    	map,
    	service,
    	interestPlace,
    	InfoWindow,
    	newBounds,
    	neighborhoodMarkers = [],
    	venueMarkers = [];

    self.foodList = ko.observableArray([]); // foods in defined neighbor hood
    self.filteredList = ko.observableArray(self.foodList()); // places filtered by searching
    self.neighborhood = ko.observable("Los Angeles"); // defined neighborhood
    self.filterWord = ko.observable(''); // search filter-word. This filter-word is used for place filtering
    self.listOpen = ko.observable(window.innerWidth >= 900); // boolean value for list toggle
    self.settingsBoolean = ko.observable(true); // boolean value for setting toggle
    self.errorMsg = ko.observable(''); // Message will show to user
    self.errorShow = ko.observable(false)  // error msg default not to show

    // Open or close the list view
    self.switchList = function() {
        self.listOpen(!self.listOpen())
    };

    // setting toggle method. open/close setting menu
    self.switchSetting = function() {
        self.settingsBoolean(!self.settingsBoolean());
    };

    // initialize the map
    initMap();

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            disableDefaultUI: true
        });
        InfoWindow = new google.maps.InfoWindow();
    }

    // update the neighborhood
    self.computedNeighborhood = ko.computed(function() {
        if (self.neighborhood() != '') {
            // remove all markers of from map
            // when new center is defined successfully
            while (venueMarkers.length > 0) {
                var tmp = venueMarkers.pop();
                tmp.marker.setMap(null);
                tmp.marker = null;
            }
            while (neighborhoodMarkers.length > 0) {
                var tmp = neighborhoodMarkers.pop();
                tmp.setMap(null);
                tmp = null;
            }

            requestNeighborhood(self.neighborhood());
            self.filterWord('');
        }
    });

    // request neighborhood location data from PlaceService
    function requestNeighborhood(neighborhood) {
        var request = {
            query: neighborhood
        };
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, neighborhoodCallback);
    }

    // callback method for neighborhood location
    function neighborhoodCallback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            getNeighborhoodInformation(results[0]);
        }else if(status == google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR ||
            status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS){
            var curError = 'Oops, please try again or another place.';
            showError(curError);
        }else{
            var curError = 'Request failed because of:' + status +
                           '\nPlease contact ';
            self.errorLinkText('me.');
            self.errorLink('mailto:me@mail.com');
            showError(curError);
        }
    }

    // set neighborhood marker on the map and get foods from API
    function getNeighborhoodInformation(placeData) {
        var lat = placeData.geometry.location.lat();
        var lng = placeData.geometry.location.lng();
        var name = placeData.name;
        interestPlace = new google.maps.LatLng(lat, lng);
        map.setCenter(interestPlace);

        // neighborhood marker
        var marker = new google.maps.Marker({
            map: map,
            position: placeData.geometry.location,
            title: name,
            icon: "images/icon-here.png"
        });
        neighborhoodMarkers.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
            InfoWindow.setContent(name);
            InfoWindow.open(map, marker);
        });

        foursquareRequestUrl = "" +
            "https://api.foursquare.com/v2/venues/explore" +
            "?client_id=RQQPG5X43XEQKG3OXLVMFRWDFN3NGYEQJJ5WRKRMOCSSPCJC" +
            "&client_secret=KUA2SA2GBYV1TJBQO1EV5M0BARMTUAUBJKPT3VI5FLEFO3HD" +
            "&v=20130815" +
            "&ll=" + lat + "," + lng +
            "&query=food";

        $.getJSON(foursquareRequestUrl, function(){})
          .done(function(data) {
            self.foodList(data.response.groups[0].items);
            self.foodList().forEach(function(food) {
                createMarkers(food.venue);

            // change the map zoom level
            var bounds = data.response.suggestedBounds;
            if (bounds != undefined) {
                newBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(bounds.sw.lat, bounds.sw.lng),
                    new google.maps.LatLng(bounds.ne.lat, bounds.ne.lng));
                map.fitBounds(newBounds);
            }
          });
        })
          .fail(function(e){
            if(e.responseJSON == null){
                showError('Get no response from foursquare. Retry later or:')
            }else{
                var responseError = e.responseJSON.meta;
                var curError = 'Fail to get resourse from foursquare -- ' + 
                               responseError.errorDetail; 
                showError(curError);
            }
          });
    }

    // trigger click event to markers when list item is clicked
    self.clickMarker = function(venue) {
        var venueName = venue.venue.name.toLowerCase();
        for (var i in venueMarkers) {
            if (venueMarkers[i].name === venueName) {
                google.maps.event.trigger(venueMarkers[i].marker, 'click');
                map.panTo(venueMarkers[i].position);
            }
        }

        // hide list when width < 900 to show map
        if (window.innerWidth < 900) {
            self.switchList();
        }
    };

    // update list view based on filter-word
    self.displayList = ko.computed(function() {
        var venue;
        var list = [];
        var filterWord = self.filterWord().toLowerCase();
        for (var i in self.foodList()) {
            venue = self.foodList()[i].venue;
            if (venue.name.toLowerCase().indexOf(filterWord) != -1) {
                list.push(self.foodList()[i]);
            }
        }
        self.filteredList(list);
    });

    // update  markers based on filter-word
    self.displayMarkers = ko.computed(function() {
        filteringMarkersBy(self.filterWord().toLowerCase());
    });

    // filtering method for map markers
    function filteringMarkersBy(filterWord) {
        for (var i in venueMarkers) {
            if (venueMarkers[i].marker.map === null) {
                venueMarkers[i].marker.setMap(map);
            }
            if (venueMarkers[i].name.indexOf(filterWord) === -1) {
                venueMarkers[i].marker.setMap(null);
            }
        }
    }

    // create map markers of foods
    function createMarkers(venue) {
        var lat = venue.location.lat;
        var lng = venue.location.lng;
        var name = venue.name;
        var category = venue.categories[0].name;
        var position = new google.maps.LatLng(lat, lng);
        var address = venue.location.formattedAddress;
        var contact = venue.contact.formattedPhone;
        var foursquareUrl = "https://foursquare.com/v/" + venue.id;
        var rating = venue.rating;
        var url = venue.url;
        var slicedUrl;
        if (url && url.slice(0, 7) === 'http://') {
            slicedUrl = url.slice(7);
        } else if (url && url.slice(0, 8) === 'https://') {
            slicedUrl = url.slice(8);
        } else {
            slicedUrl = url;
        }

        // create a marker of a food
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: name
        });

        // TODO consider to optimize this part so that
        // There wouldn't be too many function
        marker.addListener('click', function() {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 4000);
        });
        venueMarkers.push(new MapMarkerSet(marker, name.toLowerCase(), category.toLowerCase(), position));


        // Build info window
        var fsToken;
        if (rating != undefined) {
            fsToken = '<p><a href="' + foursquareUrl + '" target="_blank"><img class="fs-icon" src="images/icon-foursquare.png"></a>' +
                '<span class="rating">' + rating.toFixed(1) + '</span></p></div>';
        } else {
            fsToken = '<p><a href="' + foursquareUrl + '" target="_blank"><img class="fs-icon" src="images/icon-foursquare.png"></a>' +
                '<span class="rating"><em>no rating available</em></span></p></div>';
        }

        // DOM element for InfoWindow content
        var startingToken = '<div class="InfoWindow"><p>' +
            '<span class="name">' + name + '</span>' +
            fsToken + '</p>' +
            '<p class="category"><span>' + category + '</span></p>' +
            '<p class="address"><span>' + address;

        var endingToken;
        if (contact != undefined && url != undefined) {
            endingToken = '</span></p><p><span class="contact">' + contact +
                '</span></p><p><a href="' + url + '" class="link" target="_blank">' + slicedUrl + '</a></p>';
        } else if (contact != undefined && url === undefined) {
            endingToken = '</span></p><p><span class="contact">' + contact + '</span></p>';
        } else if (contact === undefined && url != undefined) {
            endingToken = '</span></p><p><a href="' + url + '" class="link" target="_blank">' + slicedUrl + '</a></p>';
        } else {
            endingToken = '</span></p>';
        }

        google.maps.event.addListener(marker, 'click', function() {
            InfoWindow.setContent(startingToken + endingToken);
            InfoWindow.open(map, this);
            map.panTo(position);
        });
    }

    // make sure the map bounds get updated on page resize
    // Add filter button to toggle view list when width < 900
    window.addEventListener('resize', function(e) {
        if (newBounds != null){         // just for cases bounds not exist when first loading maps
            map.fitBounds(newBounds);   // It could be better to rebound
            $("#map").height($(window).height());                   
        }                               // But won't be a matter if not.
        var curWidth = window.innerWidth;
        if (curWidth < 900 && firstLS900) {
            firstLS900 = false;
        }
        if (curWidth >= 900) {
            firstLS900 = true;
        }
        self.listOpen(firstLS900);
    });

    function showError(errorMsg){
        self.errorMsg(errorMsg);
        self.errorShow(true);
        setTimeout(function(){
            self.errorMsg('');
            self.errorShow(false);
        }, 4500);
    }
}

// init google map is loaded successful
function initApp(){
    var MVM = new MapViewModel();
    ko.applyBindings(MVM);
};

function googleError(){
    document.getElementById('error-message').innerText = 'Fail to load google map. Try to reload or redownload project or:';
    document.getElementById('error-box').style.display = 'block';
}