let map;
function initMap() {
    // Default location if user does not allow their location.
    default_lat = 29.7604;
    default_lng = -95.3698;
    let houston = { lat: default_lat, lng: default_lng };
    map = new google.maps.Map(document.getElementById("map"), {
        center: houston,
        zoom: 14,
    });

    // Icon of user location or if user does not allow their location than default location.
    var homeIcon = {
        url: "icons\\home.png",
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40),
    };

    // Ask user if they want their current location to be used.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // If successful, set the map center to the user's location
                const userLatLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Sets map to location of user.
                map.setCenter(userLatLng);

                // Sets marker at users current location.
                new google.maps.Marker({
                    position: userLatLng,
                    map: map,
                    icon: homeIcon,
                });

                // Finds storage locations based on user location.
                fetchNearbyStorageLocations(
                    position.coords.latitude,
                    position.coords.longitude
                );
            },
            (error) => {
                console.error("Error getting user location:", error.message);
                // If user does not allow their location to be used than default location is used.
                let marker = new google.maps.Marker({
                    position: houston,
                    map: map,
                    icon: homeIcon,
                });

                fetchNearbyStorageLocations(default_lat, default_lng);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function fetchNearbyStorageLocations(latitude, longitude) {
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
        {
            location: new google.maps.LatLng(latitude, longitude),
            radius: 5000, // Units is in meters.
            type: ["storage"],
        },
        handleNearbyStorageResults
    );
}

function handleNearbyStorageResults(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        placeMarkers(results);
    }
}
function placeMarkers(locations) {
    var markerIcon = {
        url: "icons\\storage.png",
        scaledSize: new google.maps.Size(25, 25),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40),
    };

    locations.forEach((location) => {
        const marker = new google.maps.Marker({
            position: location.geometry.location,
            map: map,
            icon: markerIcon,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: location.name,
        });

        marker.addListener("mouseover", function () {
            infoWindow.open(map, marker);
        });
        marker.addListener("mouseout", function () {
            infoWindow.close();
        });
    });
}
